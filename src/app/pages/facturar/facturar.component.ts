import { FinDetFacturaService } from './../../services/fin-det-factura/fin-det-factura.service';
import { InvInvSucService } from './../../services/inv-inv-suc/inv-inv-suc.service';
import { GenPersonaService } from './../../services/gen-persona/gen-persona.service';
import { GenPersona } from './../../models/genPersona.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CliCliente } from './../../models/cli-cliente';
import { CliClienteService } from './../../services/cli-cliente/cli-cliente.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css']
})
export class FacturarComponent implements OnInit {
  clientes: CliCliente[] = [];
  clienteSeleccionado: CliCliente;
  keyword = 'identificacion';
  clienteForm: FormGroup;

  invSucursal: any[] = [];
  invSucursalSeleccionado: any;
  keywordInvSucursal = 'descripcion';
  invSucursalForm: FormGroup;
  itemsFactura: any[] = [];
  totales: any = {};

  datosGeneralesForm: FormGroup;


  constructor(
    public _cliClienteService: CliClienteService,
    public _genPersonaService: GenPersonaService,
    public _invInvSucService: InvInvSucService,
    public _finDetalleFactura: FinDetFacturaService
  ) { }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.clienteForm = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.email]),
      identificacion: new FormControl(null, Validators.required),
      direccion: new FormControl(null),
      telefono: new FormControl(null, Validators.pattern('^[0-9]+')),
      celular: new FormControl(null, Validators.pattern('^[0-9]+'))
    });


    this.invSucursalForm = new FormGroup({
      descripcion: new FormControl(null, Validators.required),
      codigo: new FormControl(null, Validators.required),
      cantidad_item: new FormControl(1, [Validators.required]),
      /* cantidad_item: new FormControl(1,{
        validators:[Validators.required],[this.getPattern]
      }), */
      parametros: new FormArray([])
    });
    this.datosGeneralesForm = new FormGroup({
      transporte: new FormControl(0, [Validators.pattern('^[0-9]+$'), Validators.required]),
      descuento: new FormControl(0, [Validators.pattern('^[0-9]{1,2}(\\.[0-9]{1,2})?$'), Validators.required])
    })
  }

  cantidadValida() {
    let regExp = new RegExp("^[0-9]+$");
    let isValid = false;
    if (this.invSucursalSeleccionado) {
      if (this.invSucursalSeleccionado.n_parametros === 0 && this.invSucursalSeleccionado.unidad !== 'UNIDAD') {
        regExp = new RegExp("^[0-9]+(\\.[0-9]{1})?$");
      }
    }
    if (regExp.test(this.invSucursalForm.value.cantidad_item)) {
      isValid = true;
    }
    return isValid;

  }

  get getParametros(): FormArray {
    return this.invSucursalForm.get('parametros') as FormArray;
  }
  limpiarFormArray(formArray:FormArray){
    formArray.clear();
  }

  aniadirParametro() {
    /* const parametro = new FormGroup({
      parametro: new FormControl(null, Validators.required)
    }); */
    const parametro = new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1})?$')]);
    this.getParametros.push(parametro);
  }


  selectEvent(item, opc) {
    if (opc === 1) {
      this.clienteSeleccionado = item;
      this.clienteForm.controls['nombre'].setValue(this.clienteSeleccionado.nombre);
      this.clienteForm.controls['email'].setValue(this.clienteSeleccionado.email);
      this.clienteForm.controls['direccion'].setValue(this.clienteSeleccionado.direccion);
      this.clienteForm.controls['telefono'].setValue(this.clienteSeleccionado.telefono);
      this.clienteForm.controls['celular'].setValue(this.clienteSeleccionado.celular);
    } else if (opc === 2) {
      this.invSucursalSeleccionado = item;
      this.invSucursalForm.controls['codigo'].setValue(this.invSucursalSeleccionado.codigo);
      console.log('inventario', this.invSucursalSeleccionado);

      for (let index = 0; index < this.invSucursalSeleccionado.n_parametros; index++) {
        this.aniadirParametro();
      }
    }
  }

  onChangeSearch(val: string, opc: number) {
    if (opc === 1) {
      this.clienteForm.controls['nombre'].setValue(null);
      this.clienteForm.controls['email'].setValue(null);
      this.clienteForm.controls['direccion'].setValue(null);
      this.clienteForm.controls['telefono'].setValue(null);
      this.clienteForm.controls['celular'].setValue(null);
      this.clienteSeleccionado = null;
      this.buscarCliente(val);
    } else if (opc === 2) {
      this.limpiarFormArray(this.getParametros);
      this.invSucursalForm.controls['codigo'].setValue(null);
      this.buscarInventarioSucursal(val);

    }

  }

  onFocused(e) {
    // do something when input is focused
  }


  buscarCliente(termino: string) {
    if (termino.length <= 0) {
      // this.cargarClientes();
      return;
    }
    //this.cargando = true;
    this._cliClienteService.buscarClientes(termino)
      .subscribe((clientes: CliCliente[]) => {
        console.log(clientes);
        this.clientes = clientes;
        //this.cargando = false;
      });
  }

  buscarInventarioSucursal(termino: string) {
    if (termino.length <= 0) {
      return;
    }
    this._invInvSucService.buscarInventarioSucursal(termino)
      .subscribe((invSucursal: any) => {
        console.log(invSucursal);
        this.invSucursal = invSucursal;
      });
  }



  createClient() {
    console.log('the method createCliente was executed!');
    if (this.clienteForm.invalid) {
      return;
    }
    let client = new CliCliente(
      this.clienteForm.value.direccion,
      this.clienteForm.value.email,
      this.clienteForm.value.celular,
      this.clienteForm.value.telefono
    );
    let person = new GenPersona(
      this.clienteForm.value.nombre,
      this.clienteForm.value.identificacion,
    );

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de crear a: ' + person.identificacion + " como cliente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, crear!'
    }).then((result) => {
      if (result.value) {
        this._genPersonaService.crearPersonaCliente(person, client)
          .subscribe(resp => {
            //this.router.navigate(['/login'])
            console.log('the person was create with sussefull', resp);
            Swal.fire('¡Exito!', "Se creo un nuevo cliente: " + resp.datos.persona.identificacion, 'success');
            this.clienteSeleccionado = new CliCliente(
              resp.datos.cliente.direccion,
              resp.datos.cliente.email,
              resp.datos.cliente.celular,
              resp.datos.cliente.telefono,
              resp.datos.cliente.img,
              resp.datos.persona.nombre,
              resp.datos.persona.identificacion,
              resp.datos.cliente.id_cliente,
              resp.datos.cliente.id_persona
            );
          });
      }
    });

  }
  updateClient() {
    console.log('the method updateCliente was executed!', this.clienteForm.value.identificacion);
    if (this.clienteForm.invalid) {
      return;
    }
    let client = new CliCliente(
      this.clienteForm.value.direccion,
      this.clienteForm.value.email,
      this.clienteForm.value.celular,
      this.clienteForm.value.telefono,
      null,
      this.clienteForm.value.nombre,
      this.clienteSeleccionado.identificacion,
      this.clienteSeleccionado.id_cliente,
      this.clienteSeleccionado.id_persona
    );
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de actualizar los datos del cliente: ' + client.identificacion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this._cliClienteService.actualizarCliente(client).subscribe((cliente: any) => {
          console.log('clientes', cliente);
          Swal.fire('¡Datos Actualizados!', 'Cliente: ' + client.identificacion, 'success');
        });
      }
    });
  }

  addItemFactura() {
    console.log('addItemFactura was executed');
    console.log(this.invSucursalForm, this.getParametros);
    let item = {
      id_inv_suc: this.invSucursalSeleccionado.id_inv_suc,
      id_inventario: this.invSucursalSeleccionado.id_inventario,
      id_sucursal: this.invSucursalSeleccionado.id_sucursal,
      id_formula: this.invSucursalSeleccionado.id_formula,
      n_parametros: this.invSucursalSeleccionado.n_parametros,
      nesecita_p: this.invSucursalSeleccionado.nesecita_p,
      codigo: this.invSucursalForm.value.codigo,
      descripcion: this.invSucursalSeleccionado.descripcion,
      cantidad_item: this.invSucursalForm.value.cantidad_item,
      cantidad: this.invSucursalForm.value.cantidad_item,
      unidad: this.invSucursalSeleccionado.unidad,
      vr_venta_domicilio: this.invSucursalSeleccionado.vr_venta_domicilio,
      vr_venta_local: this.invSucursalSeleccionado.vr_venta_local,
      sub_total: 0,
      descuento: 0,
      vr_descuento: 0,
      vr_transporte: 0,
      vr_antes_iva: 0,
      iva: 0,
      vr_iva: 0,
      total: 0,
      parametros: []
    }
    this.itemsFactura.push(item);
    for (let index = 0; index < this.getParametros.length; index++) {
      console.log(this.invSucursalForm.get('parametros').value[index]);
      item.parametros.push(this.invSucursalForm.get('parametros').value[index]);
    }
    console.log(item);
    this.calcularPreciosItemsFactura();
  }

  calcularPreciosItemsFactura() {
    let datosGenerales = {
      transporte: this.datosGeneralesForm.value.transporte,
      descuento: this.datosGeneralesForm.value.descuento,
    };
    this._finDetalleFactura.calcularPreciosItemsFactura(this.itemsFactura, datosGenerales)
      .subscribe((res: any) => {
        console.log(res);
        this.itemsFactura = res.itemsFactura;
        this.totales = res.totales;
      });
  }

  changeDatosGenerales() {
    if (this.datosGeneralesForm.valid && this.itemsFactura !== []) {
      this.calcularPreciosItemsFactura();
    }
  }
}


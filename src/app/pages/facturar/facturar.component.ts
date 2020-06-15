import { FinDetFacturaService } from './../../services/fin-det-factura/fin-det-factura.service';
import { InvInvSucService } from './../../services/inv-inv-suc/inv-inv-suc.service';
import { GenPersonaService } from './../../services/gen-persona/gen-persona.service';
import { GenPersona } from './../../models/genPersona.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('card_inventario') card_inventario: ElementRef;
  @ViewChild('table_items') table_items: ElementRef;
  editar: boolean = false;
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

  instalado = false;
  esCambio = false;
  banBtnCambio = false;

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
      instalado: new FormControl(false),
      /* cantidad_item: new FormControl(1,{
        validators:[Validators.required],[this.getPattern]
      }), */
      parametros: new FormArray([])
    });
    this.datosGeneralesForm = new FormGroup({
      transporte: new FormControl(0, [Validators.pattern('^[0-9]+$'), Validators.required]),
      descuento: new FormControl(0, [Validators.pattern('^[0-9]{1,2}(\\.[0-9]{1,2})?$'), Validators.required]),
      abono: new FormControl(0, [Validators.pattern('^[0-9]+$'), Validators.required])
    });
  }
  selectCambio(item: any) {
    console.log("entro");
    this.editar = false;
    this.banBtnCambio = false;
    if (!item) {
      this.itemsFactura.forEach(element => {
        if (element.cambio === 'S') {
          element.esCambio = this.esCambio;
        }
      });
    }
    this.itemsFactura.forEach(element => {
      if (element.esCambio) {
        this.banBtnCambio = true;
      }
    });
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

  maxValidoParametro() {
    if (this.getParametros.valid) {
      if (this.invSucursalSeleccionado.maximos_p !== []) {
        for (let j = 0; j < this.invSucursalSeleccionado.maximos_p.length; j++) {
          let contador = 0;
          for (let i = 0; i < this.getParametros.length; i++) {
            if (this.getParametros.value[i] > this.invSucursalSeleccionado.maximos_p[j]) {
              contador++;
            }
            if (contador > j) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  get getParametros(): FormArray {
    return this.invSucursalForm.get('parametros') as FormArray;
  }
  limpiarFormArray(formArray: FormArray) {
    formArray.clear();
  }
  limpiarFormulario(formGroup: FormGroup) {
    formGroup.reset();
  }

  aniadirParametro() {
    /* const parametro = new FormGroup({
      parametro: new FormControl(null, Validators.required)
    }); */
    const parametro = new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1})?$')]);
    this.getParametros.push(parametro);
  }

  clearedEvente(opc) {
    if (opc === 1) {

    } else if (opc === 2) {
      this.limpiarFormulario(this.invSucursalForm);
      this.limpiarFormArray(this.getParametros);
    }
  }

  selectEvent(item, opc) {
    console.log("Seleccionado", item);
    if (opc === 1) {
      this.clienteSeleccionado = item;
      this.clienteForm.controls['nombre'].setValue(this.clienteSeleccionado.nombre);
      this.clienteForm.controls['email'].setValue(this.clienteSeleccionado.email);
      this.clienteForm.controls['direccion'].setValue(this.clienteSeleccionado.direccion);
      this.clienteForm.controls['telefono'].setValue(this.clienteSeleccionado.telefono);
      this.clienteForm.controls['celular'].setValue(this.clienteSeleccionado.celular);
    } else if (opc === 2) {
      this.invSucursalSeleccionado = item;
      console.log("items", this.invSucursalSeleccionado.Componentes);
      this.invSucursalForm.controls['codigo'].setValue(this.invSucursalSeleccionado.codigo);
      this.invSucursalSeleccionado.cambio = this.invSucursalSeleccionado.cambio;
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
    console.log(this.invSucursalForm, this.getParametros, this.invSucursalSeleccionado);
    let item = {
      Componentes: this.invSucursalSeleccionado.Componentes,
      cambio: this.invSucursalSeleccionado.cambio,
      esCambio: false,
      id_grupo: this.invSucursalSeleccionado.id_grupo,
      id_inv_suc: this.invSucursalSeleccionado.id_inv_suc,
      id_inventario: this.invSucursalSeleccionado.id_inventario,
      id_sucursal: this.invSucursalSeleccionado.id_sucursal,
      id_formula: this.invSucursalSeleccionado.id_formula,
      n_parametros: this.invSucursalSeleccionado.n_parametros,
      nesecita_p: this.invSucursalSeleccionado.nesecita_p,
      maximos_p: this.invSucursalSeleccionado.maximos_p,
      codigo: this.invSucursalForm.value.codigo,
      descripcion: this.invSucursalSeleccionado.descripcion,
      cantidad_item: this.invSucursalForm.value.cantidad_item,
      cantidad: this.invSucursalForm.value.cantidad_item,
      unidad: this.invSucursalSeleccionado.unidad,
      vr_venta_domicilio: this.invSucursalSeleccionado.vr_venta_domicilio,
      vr_venta_local: this.invSucursalSeleccionado.vr_venta_local,
      vr_venta: 0,
      sub_total: 0,
      descuento: 0,
      vr_descuento: 0,
      vr_transporte: 0,
      vr_antes_iva: 0,
      iva: 0,
      vr_iva: 0,
      total: 0,
      parametros: []
    };
    if (this.invSucursalForm.value.instalado) {
      item.vr_venta = this.invSucursalSeleccionado.vr_venta_domicilio;
    } else if (!this.invSucursalForm.value.instalado) {
      item.vr_venta = this.invSucursalSeleccionado.vr_venta_local;
    }
    console.log("items", this.itemsFactura);
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
  changeVrVenta() {
    if (this.instalado) {
      this.itemsFactura.forEach(element => {
        element.vr_venta = element.vr_venta_domicilio;
      });
    } else if (!this.instalado) {
      this.itemsFactura.forEach(element => {
        element.vr_venta = element.vr_venta_local;
      });
    }
    this.calcularPreciosItemsFactura();
  }

  deletedItem(item) {
    let i = this.itemsFactura.indexOf(item);
    this.itemsFactura.splice(i, 1);
    this.calcularPreciosItemsFactura();
  }
  editItem(item) {
    this.limpiarFormArray(this.getParametros);
    this.selectEvent(item, 2);
    this.invSucursalForm.controls['descripcion'].setValue(item.descripcion);
    this.invSucursalForm.controls['cantidad_item'].setValue(item.cantidad_item);
    this.getParametros.setValue(item.parametros);

    this.card_inventario.nativeElement.focus();
    this.card_inventario.nativeElement.scrollIntoView({ block: "center" });
    this.esCambio = false;
    this.selectCambio(null);
    this.editar = true;
  }
  aplitChangueItem() {
    console.log('formulario', this.invSucursalForm);
    let i = this.itemsFactura.indexOf(this.invSucursalSeleccionado);
    this.itemsFactura[i].cantidad_item = this.invSucursalForm.value.cantidad_item;
    this.itemsFactura[i].parametros = [];
    for (let index = 0; index < this.getParametros.length; index++) {
      this.itemsFactura[i].parametros.push(this.getParametros.value[index]);
    }
    console.log('posicion', i);
    this.calcularPreciosItemsFactura();

    this.table_items.nativeElement.scrollIntoView(true);
    this.limpiarFormulario(this.invSucursalForm);
    this.limpiarFormArray(this.getParametros);
    this.editar = false;
  }
  cambiarItems() {
    this.itemsFactura.forEach(element => {
      if (element.id_grupo === this.invSucursalSeleccionado.id_grupo && element.esCambio) {
        console.log("entor1siiii");
        element.Componentes = this.invSucursalSeleccionado.Componentes;
        element.cambio = this.invSucursalSeleccionado.cambio;
        element.esCambio = false;
        element.id_grupo = this.invSucursalSeleccionado.id_grupo;
        element.id_inv_suc = this.invSucursalSeleccionado.id_inv_suc;
        element.id_inventario = this.invSucursalSeleccionado.id_inventario;
        element.id_sucursal = this.invSucursalSeleccionado.id_sucursal;
        element.id_formula = this.invSucursalSeleccionado.id_formula;
        element.n_parametros = this.invSucursalSeleccionado.n_parametros;
        element.nesecita_p = this.invSucursalSeleccionado.nesecita_p;
        element.maximos_p = this.invSucursalSeleccionado.maximos_p;
        element.codigo = this.invSucursalForm.value.codigo;
        element.descripcion = this.invSucursalSeleccionado.descripcion;
        element.unidad = this.invSucursalSeleccionado.unidad;
        element.vr_venta_domicilio = this.invSucursalSeleccionado.vr_venta_domicilio;
        element.vr_venta_local = this.invSucursalSeleccionado.vr_venta_local;
        if (this.invSucursalForm.value.instalado) {
          element.vr_venta = this.invSucursalSeleccionado.vr_venta_domicilio;
        } else if (!this.invSucursalForm.value.instalado) {
          element.vr_venta = this.invSucursalSeleccionado.vr_venta_local;
        }
        console.log(element);
      }
    });
    this.esCambio=false;
    this.selectCambio(null);
    this.calcularPreciosItemsFactura();
  }
}




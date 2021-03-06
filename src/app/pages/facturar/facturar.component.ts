import { FinFacturaService } from './../../services/fin-factura/fin-factura.service';
import { FinDetFacturaService } from './../../services/fin-det-factura/fin-det-factura.service';
import { InvInvSucService } from './../../services/inv-inv-suc/inv-inv-suc.service';
import { GenPersonaService } from './../../services/gen-persona/gen-persona.service';
import { GenPersona } from './../../models/genPersona.model';
import { Component, OnInit, ViewChild, ElementRef, SimpleChanges,Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CliCliente } from './../../models/cli-cliente';
import { CliClienteService } from './../../services/cli-cliente/cli-cliente.service';
import Swal from 'sweetalert2';
import { PdfMakeWrapper, Txt, Table, Img } from 'pdfmake-wrapper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css']
})

export class FacturarComponent implements OnInit {
  @ViewChild('card_inventario') card_inventario: ElementRef;
  @ViewChild('table_items') table_items: ElementRef;

  clientes: CliCliente[] = [];
  clienteSeleccionado: CliCliente;
  keyword = 'identificacion';
  clienteForm: FormGroup;

  invSucursal: any[] = [];
  invSucursalSeleccionado:any;
  keywordInvSucursal = 'descripcion';
  invSucursalForm: FormGroup;
  itemsFactura: any[] = [];
  totales: any = {};
  facturaSeleccionada: any = null;
  datosGeneralesForm: FormGroup;

  pagoForm: FormGroup;
  // banderas
  instalado = false;
  esCambio = false;
  banBtnCambio = false;
  editar: boolean = false;
  esConsulta: boolean = false;
  esEdicion: boolean = false;
  esCotizacion: boolean = false;
  noEditar: boolean = false;
  realizarPago: boolean = false;
  oculto: string = 'oculto';
  banSinRegistrar: boolean = false;


  constructor(
    public _cliClienteService: CliClienteService,
    public _genPersonaService: GenPersonaService,
    public _invInvSucService: InvInvSucService,
    public _finDetalleFactura: FinDetFacturaService,
    public _finFacturaService: FinFacturaService,
    private rutaActiva: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    /* while(true){
      console.log("inicia");
    } */

    console.log("inicia");
    let a = 2;
    console.log("inicia", a);
    this.initForm();
    let parametros = this.rutaActiva.snapshot.params;
    if (parseInt(parametros.id, 10) !== -1) {
      this.obtenerFactura(parseInt(parametros.id, 10));
      this.esConsulta = true;
    }
    this.rutaActiva.params.subscribe((params) => {

      if (params != parametros) {
        this.redirectTo(this.router.url);
      }
      //this.redirectTo(this.router.url);
    });
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
      parametros: new FormArray([])
    });
    this.datosGeneralesForm = new FormGroup({
      transporte: new FormControl(0, [Validators.pattern('^[0-9]+$'), Validators.required]),
      descuento: new FormControl(0, [Validators.pattern('^[0-9]{1,2}(\\.[0-9]{1,2})?$'), Validators.required]),
      abono: new FormControl(0, [Validators.pattern('^[0-9]+$'), Validators.required])
    });
    /* this.invSucursalForm.get('descripcion')
      .valueChanges
      .subscribe(value => {
        console.log(this.invSucursalSeleccionado, value);
        if (this.invSucursalSeleccionado.grupo === 'SIN REGISTRAR') {
          this.banSinRegistrar=true;
          const v = [Validators.required];
          this.invSucursalForm.get('detalle').setValidators(v);
        } else {
          this.invSucursalForm.get('detalle').setValidators([]);
        }
        this.invSucursalForm.updateValueAndValidity();
      }); */
  }
  selectCambio(item: any) {
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
    console.log("item selec", item);
    if (opc === 1) {
      this.clienteSeleccionado = item;
      this.clienteForm.controls['identificacion'].setValue(this.clienteSeleccionado.identificacion);
      this.clienteForm.controls['nombre'].setValue(this.clienteSeleccionado.nombre);
      this.clienteForm.controls['email'].setValue(this.clienteSeleccionado.email);
      this.clienteForm.controls['direccion'].setValue(this.clienteSeleccionado.direccion);
      this.clienteForm.controls['telefono'].setValue(this.clienteSeleccionado.telefono);
      this.clienteForm.controls['celular'].setValue(this.clienteSeleccionado.celular);
    } else if (opc === 2) {
      this.invSucursalSeleccionado = item;
      this.invSucursalForm.controls['codigo'].setValue(this.invSucursalSeleccionado.codigo);
      this.invSucursalSeleccionado.cambio = this.invSucursalSeleccionado.cambio;
      if (this.invSucursalSeleccionado.grupo === 'SIN REGISTRAR') {

        let v = [Validators.required];
        //this.invSucursalForm.get('detalle').setValidators(v);
        //this.invSucursalForm.get('vr_unitario').setValidators(v);
        this.invSucursalForm.addControl('detalle',new FormControl(null, Validators.required));
        this.invSucursalForm.addControl('vr_unitario',new FormControl(null, Validators.required));
        //this.testForm.addControl('new', ('', Validators.required));
        //this.invSucursalForm.updateValueAndValidity();
        this.banSinRegistrar = true;
      }else if(this.banSinRegistrar){
        this.banSinRegistrar = false;
        this.invSucursalForm.removeControl('detalle');
        this.invSucursalForm.removeControl('vr_unitario');
      }
      console.log("item selec", this.invSucursalSeleccionado);
      for (let index = 0; index < this.invSucursalSeleccionado.n_parametros; index++) {
        this.aniadirParametro();
      }
    } else if (opc === 3) {
      this.datosGeneralesForm.controls['abono'].setValue(item.abono);
      this.datosGeneralesForm.controls['transporte'].setValue(item.transporte);
      this.datosGeneralesForm.controls['descuento'].setValue(item.descuento);
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
        this.clientes = clientes;
        //this.cargando = false;
      });
  }

  buscarInventarioSucursal(termino: string) {
    if (termino.length <= 0) {
      return;
    }
    this._invInvSucService.buscarInventarioSucursal(termino)
      .subscribe((resp: any) => {
        console.log("ivnetariosusususu",resp);
        this.invSucursal = resp.resultado;
      });
  }



  createClient() {
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

          Swal.fire('¡Datos Actualizados!', 'Cliente: ' + client.identificacion, 'success');
        });
      }
    });
  }

  addItemFactura() {

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
      costo_promedio: this.invSucursalSeleccionado.costo_promedio,
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
    if(this.banSinRegistrar){
      item.descripcion=this.invSucursalForm.value.detalle;
      item.vr_venta=this.invSucursalForm.value.vr_unitario;
    } else if (this.invSucursalForm.value.instalado) {
      item.vr_venta = this.invSucursalSeleccionado.vr_venta_domicilio;
    } else if (!this.invSucursalForm.value.instalado) {
      item.vr_venta = this.invSucursalSeleccionado.vr_venta_local;
    }

    this.itemsFactura.push(item);
    for (let index = 0; index < this.getParametros.length; index++) {

      item.parametros.push(this.invSucursalForm.get('parametros').value[index]);
    }
    console.log("items", this.itemsFactura);
    this.calcularPreciosItemsFactura();
  }

  calcularPreciosItemsFactura() {
    let datosGenerales = {
      transporte: this.datosGeneralesForm.value.transporte,
      descuento: this.datosGeneralesForm.value.descuento,
    };
    this._finDetalleFactura.calcularPreciosItemsFactura(this.itemsFactura, datosGenerales)
      .subscribe((res: any) => {

        this.itemsFactura = res.itemsFactura;
        this.totales = res.totales;
        console.log("itemss", this.itemsFactura);
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

    let i = this.itemsFactura.indexOf(this.invSucursalSeleccionado);
    this.itemsFactura[i].cantidad_item = this.invSucursalForm.value.cantidad_item;
    this.itemsFactura[i].parametros = [];
    for (let index = 0; index < this.getParametros.length; index++) {
      this.itemsFactura[i].parametros.push(this.getParametros.value[index]);
    }

    this.calcularPreciosItemsFactura();

    this.table_items.nativeElement.scrollIntoView(true);
    this.limpiarFormulario(this.invSucursalForm);
    this.limpiarFormArray(this.getParametros);
    this.editar = false;
  }
  cambiarItems() {
    this.itemsFactura.forEach(element => {
      if (element.id_grupo === this.invSucursalSeleccionado.id_grupo && element.esCambio) {
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
        element.costo_promedio = this.invSucursalSeleccionado.costo_promedio;
        if (this.invSucursalForm.value.instalado) {
          element.vr_venta = this.invSucursalSeleccionado.vr_venta_domicilio;
        } else if (!this.invSucursalForm.value.instalado) {
          element.vr_venta = this.invSucursalSeleccionado.vr_venta_local;
        }

      }
    });
    this.esCambio = false;
    this.selectCambio(null);
    this.calcularPreciosItemsFactura();
  }
  validarFormularios(esCotizacion) {
    let esValido = true;
    if (this.clienteForm.invalid) { esValido = false; }
    if (this.datosGeneralesForm.invalid) { esValido = false; }
    if (this.itemsFactura.length === 0) { esValido = false; }
    if (this.facturaSeleccionada && this.itemsFactura === this.facturaSeleccionada.items && !this.esCotizacion) { esValido = false; }
    if (this.datosGeneralesForm.value.abono === 0 && !esCotizacion) { esValido = false; }
    return esValido;
  }
  guardarFactura(esCotizacion) {
    if (!this.validarFormularios(esCotizacion)) {
      return;
    }
    let id_factura = null;

    let datosGenerales = {
      transporte: this.datosGeneralesForm.value.transporte,
      descuento: this.datosGeneralesForm.value.descuento,
      abono: this.datosGeneralesForm.value.abono,
      id_factura: null,
      items_factura: null,
      antEsCotizacion: this.esCotizacion,
      esCotizacion: esCotizacion
    };

    if (this.facturaSeleccionada) {
      datosGenerales.id_factura = this.facturaSeleccionada.id_factura;
      datosGenerales.items_factura = this.facturaSeleccionada.items;
    }
    this._finFacturaService.guardarFactura(this.clienteSeleccionado.id_cliente, this.itemsFactura, datosGenerales)
      .subscribe((res: any) => {

        this.redirectTo('facturar/' + res.result);

      });
  }
  obtenerFactura(id_factura) {

    this._finFacturaService.obtenerFactura(id_factura)
      .subscribe(async (res: any) => {
        this.facturaSeleccionada = res.result;
        this.clienteSeleccionado = new CliCliente(
          this.facturaSeleccionada.CliCliente.direccion,
          this.facturaSeleccionada.CliCliente.email,
          this.facturaSeleccionada.CliCliente.celular,
          this.facturaSeleccionada.CliCliente.telefono,
          null,
          this.facturaSeleccionada.CliCliente.nombre,
          this.facturaSeleccionada.CliCliente.identificacion,
          this.facturaSeleccionada.CliCliente.id_cliente,
          this.facturaSeleccionada.CliCliente.id_persona,
          true
        );
        this.selectEvent(this.clienteSeleccionado, 1);
        this.itemsFactura = Object.assign(this.itemsFactura, this.facturaSeleccionada.items);
        this.totales = this.facturaSeleccionada.totales;
        this.facturaSeleccionada.saldo = parseFloat(this.facturaSeleccionada.saldo);
        this.facturaSeleccionada.total = parseFloat(this.facturaSeleccionada.total);
        if (this.facturaSeleccionada.estado === 'COTIZACION') { this.esCotizacion = true; }
        if (this.facturaSeleccionada.estado === 'CANCELADO(A)' || this.facturaSeleccionada.estado === 'ELIMINADO(A)') { this.noEditar = true; }
        this.selectEvent({
          abono: parseFloat((this.facturaSeleccionada.total
            - this.facturaSeleccionada.saldo).toFixed(2)),
          transporte: parseInt(this.facturaSeleccionada.transporte),
          descuento: parseInt(this.facturaSeleccionada.descuento)
        }, 3);

      });

  }
  redirectTo(uri) {
    if (uri) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate([uri]));
      return;
    }
    this.redirectTo('facturar/' + parseInt(this.facturaSeleccionada.id_factura, 10));
  }

  async generatePdf() {
    let arrayData = [];
    let data: any = [];
    let fecha = new Date(this.facturaSeleccionada.fec_factura);
    const pdf = new PdfMakeWrapper();

    data.push(['Cantidad', 'Detalle', 'Vr Unitario', 'Vr Total']);
    for (let index = 0; index < this.itemsFactura.length; index++) {
      if (index % 30 === 0 && index > 0) {
        arrayData.push(data);
        data = [];
      } else {
        data.push([this.itemsFactura[index].cantidad_item, this.itemsFactura[index].codigo + ' ' + this.itemsFactura[index].descripcion,
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((this.itemsFactura[index].total / this.itemsFactura[index].cantidad_item)),
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.itemsFactura[index].total)]);
      }
    }
    data.push(["", "", "TOTAL", Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.totales.total)]);
    arrayData.push(data);

    let y = 0;
    for (let index = 0; index < arrayData.length; index++) {
      y = 0;
      pdf.add(await new Img('../../../assets/images/marca_agua_doc.png').height(500).width(300).relativePosition(100, 100).build());
      pdf.add(await new Img('../../../assets/images/logo_fac.png').height(80).width(250).relativePosition(0, 0).build());
      if (!this.esCotizacion) {
        pdf.add(
          new Txt('FACTURA No: ' + this.facturaSeleccionada.num_factura).bold().italics().fontSize(18).relativePosition(260, 0).end,
        );
      }
      else {
        pdf.add(
          new Txt('COTIZACION No: ' + this.facturaSeleccionada.num_factura).bold().italics().fontSize(18).relativePosition(260, 0).end,
        );
      }
      pdf.add(
        new Txt('FECHA: ' + fecha.getDate() + '-' + fecha.getMonth() + '-' + fecha.getFullYear())
          .bold().italics().fontSize(10).relativePosition(260, 25).end
      );
      pdf.add(
        new Txt('CLIENTE: ' + this.facturaSeleccionada.CliCliente.nombre).bold().italics().fontSize(10).relativePosition(260, 35).end
      );
      pdf.add(
        new Txt('IDENTIFICACION: ' + this.facturaSeleccionada.CliCliente.identificacion).bold().italics().fontSize(10).relativePosition(260, 45).end
      );
      pdf.add(
        new Txt('CELULAR: ' + this.facturaSeleccionada.CliCliente.celular).bold().italics().fontSize(10).relativePosition(260, 55).end
      );
      pdf.add(
        new Txt('ESTADO: ' + this.facturaSeleccionada.estado).bold().italics().fontSize(10).relativePosition(260, 65).end
      );
      if (!this.esCotizacion) {
        pdf.add(
          new Txt('SALDO: ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.facturaSeleccionada.saldo)).bold().italics().fontSize(10).relativePosition(260, 75).end
        );
      }

      if (index == arrayData.length - 1) {

        pdf.add(
          new Table(arrayData[index]).widths(['auto', '*', 'auto', 'auto']).relativePosition(0, 105).end
        );
      } else {

        pdf.add(
          new Table(arrayData[index]).widths(['auto', '*', 'auto', 'auto']).relativePosition(0, 105).pageBreak("after").end
        );
      }
      y = arrayData[index].length * 20 + 105
    }
    if (y >= 708) {
      pdf.add(
        new Txt('').bold().italics().fontSize(20).relativePosition(0, y).pageBreak("after").end
      );
      y = 0;
    }
    pdf.add(
      new Txt('RESUMEN DE PAGO').bold().italics().fontSize(12).relativePosition(0, y).color('#143d69').end
    );
    y = y + 12;
    pdf.add(
      new Txt('Subtotal:').bold().italics().fontSize(10).relativePosition(0, y).end
    );
    pdf.add(
      new Txt(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.totales.sub_total)).bold().italics().fontSize(10).relativePosition(100, y).end
    );
    y += 12;
    pdf.add(
      new Txt('Descuento [' + this.facturaSeleccionada.descuento + '%]: ').bold().italics().fontSize(10).relativePosition(0, y).end
    );
    pdf.add(
      new Txt(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.totales.vr_descuento)).bold().italics().fontSize(10).relativePosition(100, y).end
    );
    y += 12;
    pdf.add(
      new Txt('Transporte: ').bold().italics().fontSize(10).relativePosition(0, y).end
    );
    pdf.add(
      new Txt(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.totales.transporte)).bold().italics().fontSize(10).relativePosition(100, y).end
    );
    y += 12;
    pdf.add(
      new Txt('TOTAL: ').bold().italics().fontSize(10).relativePosition(0, y).color('#9f182f').end
    );
    pdf.add(
      new Txt(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.totales.total)).color('#9f182f').bold().italics().fontSize(10).relativePosition(100, y).end
    );
    y += 15;

    if (this.facturaSeleccionada.FinAboFacs.length > 0) {

      if (y > 760) {
        y = 0;
        pdf.add(
          new Txt('ABONOS').bold().italics().fontSize(12).relativePosition(0, y).pageBreak("before").color('#096b25').end
        );
      } else {

        pdf.add(
          new Txt('ABONOS').bold().italics().fontSize(12).relativePosition(0, y).color('#096b25').end
        );
      }
      y = y + 12;
      let deuda = this.facturaSeleccionada.total;
      for (const element of this.facturaSeleccionada.FinAboFacs) {
        let fec_abo = new Date(element.fec_abono);
        if (y >= 758) {
          pdf.add(
            new Txt('').bold().italics().fontSize(20).relativePosition(0, y).pageBreak("after").end
          );
          y = 0;
        }
        pdf.add(
          new Txt(
            'Fecha: ' + fecha.getDate() + '-' + fecha.getMonth() + '-' + fecha.getFullYear() + " " +
            'Deuda: ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(deuda) + " " +
            'Efectivo: ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(element.pago) + " " +
            'Abono: ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(element.abono) + " " +
            'Regreso: ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(element.regreso) + " " +
            'Saldo: ' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(element.saldo)
          ).bold().italics().fontSize(10).relativePosition(0, y).end
        );
        y = y + 10;
        deuda = element.saldo;
      }
    }

    pdf.create().download(this.facturaSeleccionada.num_factura);
  }

  mostrarModalPago() {


    this.pagoForm = new FormGroup({
      abono: new FormControl(0, [Validators.pattern('^[0-9]+$'), Validators.required, Validators.min(50), Validators.max(this.facturaSeleccionada.saldo)]),
      pago: new FormControl(0, [Validators.pattern('^[0-9]+$'), Validators.required, Validators.min(50)])
    });
    this.oculto = '';

  }

  agregarPagoFacturaId() {

    if (this.pagoForm.invalid || (this.pagoForm.value.pago - this.pagoForm.value.abono) < 0) { return; }
    let abono = {
      id_factura: this.facturaSeleccionada.id_factura,
      abono: this.pagoForm.value.abono,
      pago: this.pagoForm.value.pago,
    }
    this._finFacturaService.agregarPagoFacturaId(abono)
      .subscribe((res: any) => {
        this.redirectTo('facturar/' + this.facturaSeleccionada.id_factura);
      });

  }
  cerrarModalPago() {
    this.oculto = 'oculto';
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("camsadfasdfasdf");
    console.log("cambio",changes.invSucursalSeleccionado.currentValue);

    //this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }
}

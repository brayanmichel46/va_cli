import { Component, OnInit } from '@angular/core';
import { FinDetFacturaService } from './../../services/fin-det-factura/fin-det-factura.service';
import { InvInvSucService } from './../../services/inv-inv-suc/inv-inv-suc.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { PdfMakeWrapper, Txt, Table, Cell, Img } from 'pdfmake-wrapper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-matriz-marqueteria',
  templateUrl: './matriz-marqueteria.component.html',
  styleUrls: ['./matriz-marqueteria.component.css']
})
export class MatrizMarqueteriaComponent implements OnInit {
  invSucursal: any[] = [];
  invSucursalSeleccionado: any;
  keywordInvSucursal = 'descripcion';
  invSucursalForm: FormGroup;
  itemsFactura: any[] = [];
  constructor(
    public _invInvSucService: InvInvSucService,
    public _finDetalleFactura: FinDetFacturaService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.invSucursalForm = new FormGroup({
      descripcion: new FormControl(null, Validators.required),
      codigo: new FormControl(null, Validators.required),
      detalle: new FormControl(null),
    });

  }
  addItemFactura() {
    this.itemsFactura=[];
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
      cantidad_item: 1,
      cantidad: 1,
      unidad: this.invSucursalSeleccionado.unidad,
      vr_venta_domicilio: this.invSucursalSeleccionado.vr_venta_domicilio,
      vr_venta_local: this.invSucursalSeleccionado.vr_venta_local,
      costo_promedio: this.invSucursalSeleccionado.costo_promedio,
      vr_venta: this.invSucursalSeleccionado.vr_venta_local,
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
    for (let i = 15; i <= 110; i+=5) {

      for (let j = 15; j <= 110; j+=5) {
        item.parametros.push(i);
        item.parametros.push(j);
        this.itemsFactura.push(JSON.parse(JSON.stringify(item)));
        item.parametros=[];
      }
    }

    console.table("items factura",this.itemsFactura);
    this.calcularPreciosItemsFactura();
  }
  calcularPreciosItemsFactura() {
    let datosGenerales = {
      transporte: 0,
      descuento: 0
    };
    this._finDetalleFactura.calcularPreciosItemsFactura(this.itemsFactura, datosGenerales)
      .subscribe((res: any) => {

        this.itemsFactura = res.itemsFactura;
        //this.totales = res.totales;


       /*  this.itemsFactura.forEach(e => {
          let p=(((100-(e.parametros[0]))/e.parametros[1]))*100;

          //cadena
          if(p<=10){

          }
          if(p<=60){
            //
          }else if(p>60 && p<=75){
            //
          }else{
            //
          }

          //
        }); */
        this.generatePdf();
      });
  }
  selectEvent(item) {
    //

      this.invSucursalSeleccionado = item;
      this.invSucursalForm.controls['codigo'].setValue(this.invSucursalSeleccionado.codigo);
      this.invSucursalSeleccionado.cambio = this.invSucursalSeleccionado.cambio;


  }

  get getParametros(): FormArray {
    return this.invSucursalForm.get('parametros') as FormArray;
  }

  onChangeSearch(val: string) {
      this.invSucursalForm.controls['codigo'].setValue(null);
      this.buscarInventarioSucursal(val);
  }

  buscarInventarioSucursal(termino: string) {
    if (termino.length <= 0) {
      return;
    }
    this._invInvSucService.buscarInventarioSucursal(termino)
      .subscribe((invSucursal: any) => {

        this.invSucursal = invSucursal.resultado;
      });
  }
  clearedEvente() {
      this.limpiarFormulario(this.invSucursalForm);
  }
  onFocused(e) {
    // do something when input is focused
  }
  limpiarFormulario(formGroup: FormGroup) {
    formGroup.reset();
  }
  async generatePdf() {
    let arrayData = [];
    let arrayData2 = [];
    let data: any = [];
    let data2: any=[];
    const pdf = new PdfMakeWrapper();
    const pdf2 = new PdfMakeWrapper();
    let vectorTotales = [];
    let cont=0;
    let total = [];
    for (let i = 0; i < this.itemsFactura.length; i++) {
      total.push(JSON.parse(JSON.stringify(this.itemsFactura[i].total+" "+this.itemsFactura[i].accesorio)));

      cont++;
      if(cont>19){
        vectorTotales.push(JSON.parse(JSON.stringify(total)));
        total=[];
        cont=0;
      }
    }


    let m1 = vectorTotales.splice(0,(vectorTotales.length/2));

    let m2 = vectorTotales.splice(0,vectorTotales.length);

    //data.push(['X','15', '20', '25', '30','35', '40', '45','50','55', '60', '65', '70','75', '80', '85','90','95','100','105','110']);
    //data.push(['X','15', '20', '25', '30','35', '40', '45','50','55', '60','65','70','75']);
    data.push(['X','15','20','25','30','35','40','45','50','55','60','70']);
    for (let index = 0; index < m1.length; index++) {
      if (index % 30 === 0 && index > 0) {
        arrayData.push(data);
        data = [];
      } else {
        data.push([((index+1)*5)+10,
          m1[index][0],
          m1[index][1],
          m1[index][2],
          m1[index][3],
          m1[index][4],
          m1[index][5],
          m1[index][6],
          m1[index][7],
          m1[index][8],
          m1[index][9],
          m1[index][11]]);
      }
    }
    arrayData.push(data);
    data2.push(['X','65','70','75','80','85','90','95','100','105','110']);
    m2.unshift(m1[9]);
    m2.unshift(m1[8]);
    m2.unshift(m1[7]);
    for (let index = 0; index < m2.length; index++) {
      if (index % 30 === 0 && index > 0) {
        arrayData2.push(data2);
        data2 = [];
      } else {

        data2.push([((index+1)*5)+45,
          m2[index][10],
          m2[index][11],
          m2[index][12],
          m2[index][13],
          m2[index][14],
          m2[index][15],
          m2[index][16],
          m2[index][17],
          m2[index][18],
          m2[index][19]]);
      }
    }
    arrayData2.push(data2);

    let y = 0;
    pdf.add(
      new Txt(this.invSucursalSeleccionado.descripcion).bold().italics().fontSize(15).relativePosition(0, 0).color('#143d69').end
    );
    for (let index = 0; index < arrayData.length; index++) {
      y = 0;
      /* pdf.add(await new Img('../../../assets/images/marca_agua_doc.png').height(500).width(300).relativePosition(100, 100).build()); */

      if (index == arrayData.length - 1) {

        pdf.add(
          new Table(arrayData[index]).widths(['auto', 'auto','auto','auto','auto', 'auto','auto','auto','auto','auto','auto','auto']).relativePosition(0, 25).fontSize(19).height(50).end
          //new Table(arrayData[index]).widths(['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto', 'auto', 'auto', 'auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).end
          //new Table(arrayData[index]).widths(['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).end
        );
      } else {

        pdf.add(
          new Table(arrayData[index]).widths(['auto', 'auto','auto','auto','auto', 'auto','auto','auto','auto','auto','auto','auto']).relativePosition(0, 25).fontSize(19).height(50).pageBreak("after").end
          //new Table(arrayData[index]).widths(['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto', 'auto', 'auto', 'auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).end
          //new Table(arrayData[index]).widths(['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).pageBreak("after").end
        );
      }
      y = arrayData[index].length * 20;
    }
    //if (y >= 708) {
      pdf.add(
        new Txt('').bold().italics().fontSize(20).relativePosition(0, y).pageBreak("after").end
      );
      y = 0;
    //}
    pdf.add(
      new Txt(this.invSucursalSeleccionado.descripcion).bold().italics().fontSize(15).relativePosition(0, 0).color('#143d69').end
    );
    for (let index = 0; index < arrayData2.length; index++) {
      y = 0;
      /* pdf.add(await new Img('../../../assets/images/marca_agua_doc.png').height(500).width(300).relativePosition(100, 100).build()); */

      if (index == arrayData2.length - 1) {

        pdf.add(
          new Table(arrayData2[index]).widths(['auto', 'auto','auto','auto','auto', 'auto','auto','auto','auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).end
          //new Table(arrayData2[index]).widths(['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto', 'auto', 'auto', 'auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).end
          //new Table(arrayData2[index]).widths(['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).end
        );
      } else {

        pdf.add(
          new Table(arrayData2[index]).widths(['auto', 'auto','auto','auto','auto', 'auto','auto','auto','auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).pageBreak("after").end
          //new Table(arrayData2[index]).widths(['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto', 'auto', 'auto', 'auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).end
          //new Table(arrayData2[index]).widths(['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto','auto','auto']).relativePosition(0, 25).fontSize(20).height(50).pageBreak("after").end
        );
      }
      y = arrayData2[index].length * 20;
    }
    pdf.pageSize('LEGAL');
    pdf.pageOrientation("landscape");
    pdf.create().download("precios");
  }
}

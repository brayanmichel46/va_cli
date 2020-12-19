
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FinFacturaService } from './../../services/fin-factura/fin-factura.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-facturas',
  templateUrl: './list-facturas.component.html',
  styleUrls: ['./list-facturas.component.css']
})
export class ListFacturasComponent implements OnInit {
  facturas: any = [];
  totalRegistros: number = -1;
  desde: number = 0 ;
  paginacion: any = 5;
  paginas: any = [];
  cargando: boolean = false;
  constructor(
    public _finFacturaService: FinFacturaService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.obtenerFacturas();
  }
  obtenerFacturas(){
    this.cargando = true;
    this._finFacturaService.obtenerFacturas( this.desde )
      .subscribe( (resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.facturas = resp.facturas;
        this.paginas=[];
        for (let index = 1; index <= (resp.total/this.paginacion); index++) {
          this.paginas.push(index);
        }
      });
      this.cargando = false;
  }
  cambiarDesde ( hacia: string, termino: string,pagina: number,valor: number = this.paginacion ) {
    let desde;
    console.log(hacia, valor);
    if ( hacia === 'S') {
      console.log('Entra');
      desde = this.desde + valor;
    } else if (hacia==='A') {
      desde = this.desde - valor;
      console.log('Entra', this.desde);
    } else if (hacia==='R') {
      desde=0;
    }
    if ( desde >= this.totalRegistros && this.totalRegistros>0) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }
    if(pagina){
      this.desde=(pagina-1)*5;
    }else{
      this.desde = desde;
    }
    if ( termino.length <= 0 ) {
      this.obtenerFacturas();
      return;
    }else{
      this.buscarFacturas(termino);
    }
  }

  buscarFacturas( termino: string ) {

    this.cargando = true;
    this._finFacturaService.buscarFacturas(termino,this.desde)
    .subscribe((result: any) => {
      console.log("count",result.count);
      this.paginas=[];
      for (let index = 1; index <= (result.count/this.paginacion); index++) {
        this.paginas.push(index);
      }
      this.facturas = result.facturas;
      this.totalRegistros = result.count;
      this.cargando = false;
    });
  }
  redirectTo(uri) {
      this.router.navigate([uri]);
  }

  prueba(desde,termino){
    console.log(desde);
    this.desde=desde;
    if ( termino.length <= 0 ) {
      this.obtenerFacturas();
      return;
    }else{
      this.buscarFacturas(termino);
    }
  }

}

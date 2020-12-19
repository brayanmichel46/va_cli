import { InvInvSucService } from './../../services/inv-inv-suc/inv-inv-suc.service';

import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FinFacturaService } from './../../services/fin-factura/fin-factura.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-precios',
  templateUrl: './list-precios.component.html',
  styleUrls: ['./list-precios.component.css']
})
export class ListPreciosComponent implements OnInit {

  inventario: any = [];
  totalRegistros: number = -1;
  desde: number = 0 ;
  paginacion: any = 5;
  paginas: any = [];
  cargando: boolean = false;
  constructor(
    public _invInvSucService: InvInvSucService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.obtenerInventarioSucursal();
  }
  obtenerInventarioSucursal(){
    this.cargando = true;
    this._invInvSucService.obtenerInventarioSucursal ( this.desde )
      .subscribe( (resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.inventario = resp.resultado;
        this.paginas=[];
        for (let index = 1; index <= (resp.total/this.paginacion); index++) {
          this.paginas.push(index);
        }
        this.inventario.forEach(element => {
          element.ban_editar=false;
        });
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
      this.obtenerInventarioSucursal();
      return;
    }else{
      this.buscarInventarioSucursal(termino);
    }
  }

  buscarInventarioSucursal( termino: string ) {

    this.cargando = true;
    this._invInvSucService.buscarInventarioSucursal(termino,this.desde)
    .subscribe((result: any) => {
      console.log("count",result);
      this.paginas=[];
      for (let index = 1; index <= (result.count/this.paginacion); index++) {
        this.paginas.push(index);
      }

      this.inventario = result.resultado;
      this.inventario.forEach(element => {
        element.ban_editar=false;
      });
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
      this.obtenerInventarioSucursal();
      return;
    }else{
      this.buscarInventarioSucursal(termino);
    }
  }

  actualizarInventario(inventario:any){
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de actualizar los datos del cliente: ' + inventario.descripcion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        console.log("actuaalizado" ,inventario);
        inventario.ban_editar=false;
        this._invInvSucService.actualizarInventario(inventario).subscribe((inventario: any) => {
          console.log("inventario",inventario);
          Swal.fire('¡Datos Actualizados!',  inventario.descripcion, 'success');

        });
      }
    });
  }

}

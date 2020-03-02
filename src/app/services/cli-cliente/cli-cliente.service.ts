import { GenPersona } from './../../models/genPersona.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CliCliente } from './../../models/cli-cliente';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class CliClienteService {
  token:string;
  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }
  }
  cargarClientes( desde: number = 0) {
    let url = URL_SERVICIOS + '/ventas/obtenerclientes?token=' + this.token;
    return this.http.post( url, { desde } );
  }
  buscarClientes( termino: string ) {
    let url = URL_SERVICIOS + '/va/busquedacoleccion?token=' + this.token;
    return this.http.post( url, {coleccion: 'clientes', busqueda: termino})
    .map((resp: any) => resp.clientes);
  }
  actualizarCliente( cliente: any ) {
    let url = URL_SERVICIOS + '/ventas/actualizarcliente?token=' + this.token;
    return this.http.post( url, {cliente: cliente})
    .map((resp: any) => {
        return resp.persona;
    });
  }

}

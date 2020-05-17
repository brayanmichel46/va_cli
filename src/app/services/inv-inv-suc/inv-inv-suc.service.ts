import { SegUsuarioService } from './../seg-usuario/seg-usuario.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InvInvSucService {
  token: string;
  constructor(
    public http: HttpClient,
    public router: Router,
    public segUsuarioService: SegUsuarioService
  ) {
    this.token = this.segUsuarioService.token;
  }

  obtenerInventarioSucursal(desde: number = 0) {
    let url = URL_SERVICIOS + '/inventario/obtenerInventarioSucursal?token=' + this.token;
    return this.http.post(url, { desde });
  }

  buscarInventarioSucursal(termino: string) {
    let url = URL_SERVICIOS + '/va/busquedacoleccion?token=' + this.token;
    return this.http.post(url, { coleccion: 'inv_sucursal', busqueda: termino })
      .map((resp: any) => resp.inv_sucursal);
  }  
}

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
export class FinFacturaService {
  token: string;
  constructor(
    public http: HttpClient,
    public router: Router,
    public segUsuarioService: SegUsuarioService
  ) {
    this.token = this.segUsuarioService.token;
  }

  guardarFactura(cliente: any, itemsFactura: any, datosGenerales: any) {
    let url = URL_SERVICIOS + '/financiero/guardarfactura?token=' + this.token;
    return this.http.post(url, { cliente, itemsFactura, datosGenerales })
      .map((res: any) => {
        return res;
      });
  }
  obtenerFactura(id_factura: any) {
    let url = URL_SERVICIOS + '/financiero/obtenerfactura?token=' + this.token;
    return this.http.post(url, { id_factura })
      .map((res: any) => {
        return res;
      });
  }
  agregarPagoFacturaId(abono: any) {
    let url = URL_SERVICIOS + '/financiero/agregarPagoFacturaId?token=' + this.token;
    return this.http.post(url, { abono })
      .map((res: any) => {
        return res;
      });
  }
  buscarFacturas( termino: string, desde: number = 0 ) {
    let url = URL_SERVICIOS + '/va/busquedacoleccion?token=' + this.token;
    return this.http.post( url, {coleccion: 'facturas', busqueda: termino,desde:desde})
    .map((resp: any) => resp.facturas);
  }
  obtenerFacturas( desde: number = 0) {
    let url = URL_SERVICIOS + '/financiero/obtenerfacturas?token=' + this.token;
    return this.http.post( url, { desde } );
  }
}

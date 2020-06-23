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

  guardarFactura(cliente: any, itemsFactura: any, totales: any, datosGenerales: any) {
    let url = URL_SERVICIOS + '/financiero/guardarfactura?token=' + this.token;
    return this.http.post(url, { cliente, itemsFactura, totales, datosGenerales })
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
}

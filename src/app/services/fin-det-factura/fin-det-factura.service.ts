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
export class FinDetFacturaService {
  token: string;
  constructor(
    public http: HttpClient,
    public router: Router,
    public segUsuarioService: SegUsuarioService
  ) {
    this.token = this.segUsuarioService.token;
  }

  calcularPreciosItemsFactura(itemsFactura: any, datosGenerales: any) {
    let url = URL_SERVICIOS + '/financiero/calcularpreciositemsfactura?token=' + this.token;
    return this.http.post(url, { itemsFactura, datosGenerales })
      .map((res: any) => {
        return res;
      });
  }
}

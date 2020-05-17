import { Injectable } from '@angular/core';
import { SegUsuario } from '../../models/segUsuario.model';
import { GenPersona } from '../../models/genPersona.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GenPersonaService {
  token: string;
  constructor(
    public http: HttpClient
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

  crearPersonaUsuario( usuario: SegUsuario, persona: GenPersona ) {
    let datos = {
      persona: persona,
      usuario: usuario
    };
    console.log('llega', datos);

    let url = URL_SERVICIOS + '/general/crearpersonausuario';
    return this.http.post( url, datos );
  }

  crearPersonaCliente( person:any ,client: any ) {
    console.log('it is token: ',this.token);
    let url = URL_SERVICIOS + '/general/crearpersonacliente?token=' + this.token;
    return this.http.post( url, {persona:person,cliente: client})
    .map((resp: any) => {
        return resp;
    });
  }

}

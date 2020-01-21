import { Injectable } from '@angular/core';
import { SegUsuario } from '../../models/segUsuario.model';
import { GenPersona } from '../../models/genPersona.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GenPersonaService {

  constructor(
    public http: HttpClient
  ) {
    console.log('Servicio de persona listo');
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

}

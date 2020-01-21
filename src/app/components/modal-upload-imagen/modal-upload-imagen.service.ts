import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalUploadImagenService {
  public coleccion: string;
  public id: number;

  public oculto: string = 'oculto';
  public notificacion = new EventEmitter<any>();
  constructor() { }

  ocultaModal () {
    this.oculto = 'oculto';
    this.coleccion = null;
    this.id = null;
  }

  mostrarModal ( coleccion: string, id: number ) {
    this.oculto = '';
    this.coleccion = coleccion;
    this.id = id;
  }
}

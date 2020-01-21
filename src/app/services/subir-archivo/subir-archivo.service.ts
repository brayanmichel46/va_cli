import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';


@Injectable()
export class SubirArchivoService {
  constructor(
  ) { }
  subirArchivo( archivo: File, coleccion: string, id: string, token: string ) {
    console.log('llega constoda', id);
    return new Promise(( resolve , reject) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();
      formData.append('imagen', archivo, archivo.name);
      formData.append('coleccion', coleccion);
      formData.append('id', id);
      console.log('entrando');
      xhr.onreadystatechange = () => {
        if ( xhr.readyState === 4 ) {
          if ( xhr.status === 200 ) {
            console.log('imagen subida correctamente');
            resolve( JSON.parse(xhr.response));
          } else {
            console.log('fallo la subida');
            reject( xhr.response );
          }
        }
      };
      let url = URL_SERVICIOS + '/va/upload?token=' + token;
        xhr.open('POST', url, true);
        xhr.send( formData );
    });
  }

}

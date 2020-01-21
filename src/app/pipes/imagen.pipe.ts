import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { SegUsuarioService } from '../services/seg-usuario/seg-usuario.service';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {
  constructor(
    public _segUsuarioService: SegUsuarioService
  ) {}
  transform( img: string, coleccion: string= 'usuarios' ): any {
    let url = URL_SERVICIOS + '/va/obtenerimgcoleccion';
    if ( !img ) {
      return url + '/usuarios/xxx?token=' + this._segUsuarioService.token;
    }
    if ( img.indexOf('https') >= 0) {
      return img;
    }

    switch ( coleccion ) {
      case 'usuarios' :
        url += '/usuarios/' + img + '?token=' + this._segUsuarioService.token;
      break;
      case 'personas' :
        url += '/personas/' + img + '?token=' + this._segUsuarioService.token;
      break;
      case 'clientes' :
        url += '/clientes/' + img + '?token=' + this._segUsuarioService.token;
      break;
      default:
      console.log('tipo de imagen no existe');
      url += '/usuarios/xxx?token=' + this._segUsuarioService.token;
    }
    return url;
  }

}

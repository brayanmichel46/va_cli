import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SegUsuario } from '../../models/segUsuario.model';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
@Injectable()
export class SegUsuarioService {
  token: string;
  usuario: SegUsuario;
  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }
  estaLogeado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }
  guardarStorage ( id_usuario: string, token: string, usuario: SegUsuario ) {
    localStorage.setItem('id_usuario', id_usuario);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }
  loginGoogle ( token: string ) {
    let url = URL_SERVICIOS + '/seguridad/logingoogle';
    return this.http.post(url, {token} )
    .map( (resp: any) => {
      this.guardarStorage(resp.id_usuario, resp.token, resp.usuario);
      return true;
    });
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id_usuario');
    this.router.navigate(['/login']);
  }
  login( usuario: SegUsuario, recordar: boolean ) {
    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    let url = URL_SERVICIOS + '/seguridad/login';
    return this.http.post(url, usuario)
    .map( (resp: any) => {
      this.guardarStorage(resp.id_usuario, resp.token, resp.usuario);
      return true;
    });
  }
  crearUsuario( usuario: SegUsuario ) {
    let url = URL_SERVICIOS + '/seguridad/crearusuarioweb';
    return this.http.post( url, usuario )
    .map((resp: any) => {
      Swal('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    });
  }
  actualizarUsuario( datos: any ) {

    let url = URL_SERVICIOS + '/seguridad/actualizarusuario?token=' + this.token;
    return this.http.post(url, datos)
    .map((resp: any) => {
      let usuarioDB: SegUsuario = resp.usuario;
      this.guardarStorage( usuarioDB.id_usuario.toString() , this.token, usuarioDB);
      Swal('Usuario actualizado', usuarioDB.nombre, 'success');
      return true;
    });
  }
  cambiarImagen( archivo: File, id: string ) {
    console.log('llega23');
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id, this.token)
    .then((resp: any) => {
      console.log(resp);
      this.usuario.img = resp.usuario.img;
      Swal('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario);
    }).catch(error => {
      console.log(error);
    });
  }
  cargarUsuarios( desde: number = 0) {
    let url = URL_SERVICIOS + '/seguridad/obtenerusuarios?token=' + this.token;
    return this.http.post( url, { desde } );
  }
  buscarUsuarios( termino: string ) {
    let url = URL_SERVICIOS + '/va/busquedacoleccion?token=' + this.token;
    return this.http.post( url, {coleccion: 'usuarios', busqueda: termino})
    .map((resp: any) => resp.usuarios);
  }
  desactivarUsuario( id_usuario: number ) {
    let usuario = {
      id_usuario: id_usuario,
      estado: 'I'
    };
    let url = URL_SERVICIOS + '/seguridad/desactivarusuario?token=' + this.token;
    return this.http.post(url, usuario);
  }
}

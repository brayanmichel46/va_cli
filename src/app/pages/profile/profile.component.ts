import { Component, OnInit } from '@angular/core';
import { SegUsuario } from '../../models/segUsuario.model';
import { SegUsuarioService } from '../../services/seg-usuario/seg-usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  usuario: SegUsuario;
  imagenSubir: File;
  imagenTemp: string;
  constructor(
    public _serUsuarioService: SegUsuarioService
  ) { }

  ngOnInit() {
    this.usuario = this._serUsuarioService.usuario;
  }
  guardar ( usuario: SegUsuario ) {
    usuario.id_usuario = this.usuario.id_usuario;
    let datos = {};
    if (this.usuario.email === usuario.email) {
      datos = {
        nombre: usuario.nombre,
        id_usuario: usuario.id_usuario
      };
    } else {
      datos = usuario;
    }
    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }
    this._serUsuarioService.actualizarUsuario(datos)
    .subscribe();
  }
  seleccionImagen( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );
    reader.onloadend = () => this.imagenTemp = reader.result.toString();

  }
  cambiarImagen() {
    console.log('llega', this.imagenSubir);
    this._serUsuarioService.cambiarImagen( this.imagenSubir, this.usuario.id_usuario.toString());
  }
}

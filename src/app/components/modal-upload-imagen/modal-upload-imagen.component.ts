import { Component, OnInit } from '@angular/core';
import { SubirArchivoService, SegUsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadImagenService } from './modal-upload-imagen.service';
@Component({
  selector: 'app-modal-upload-imagen',
  templateUrl: './modal-upload-imagen.component.html',
  styles: []
})
export class ModalUploadImagenComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;
  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadImagenService: ModalUploadImagenService,
    public _segUsuarioService: SegUsuarioService
  ) {
    console.log('modal listo');
   }

  ngOnInit() {
  }
  seleccionImagen( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    if ( archivo.type.indexOf('image') < 0 ) {
      Swal('Solo imagenes', 'El archivo seleccionado no es una imaen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );
    reader.onloadend = () => this.imagenTemp = reader.result;

  }
  subirImagen() {
    console.log(this.imagenTemp);
    this._subirArchivoService.subirArchivo(
      this.imagenSubir,
      this._modalUploadImagenService.coleccion,
      this._modalUploadImagenService.id.toString(),
      this._segUsuarioService.token)
    .then ( resp => {
      console.log(resp);
      this._modalUploadImagenService.notificacion.emit( resp );
      this.cerrarModal();
    })
    .catch( err => {
      console.log('Error en la carga');
    });
  }
  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUploadImagenService.ocultaModal();
  }

}

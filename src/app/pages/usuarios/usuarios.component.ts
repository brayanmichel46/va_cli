import { Component, OnInit } from '@angular/core';
import { SegUsuario } from '../../models/segUsuario.model';
import { SegUsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadImagenService } from '../../components/modal-upload-imagen/modal-upload-imagen.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: SegUsuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  paginacion: number = 5;
  cargando: boolean = false;
  constructor(
    public _segUsuarioService: SegUsuarioService,
    public _modalUploadImagenService: ModalUploadImagenService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadImagenService.notificacion
    .subscribe( resp => {
      this.cargarUsuarios();
    });
  }
  cargarUsuarios() {
    this.cargando = true;
    this._segUsuarioService.cargarUsuarios( this.desde )
    .subscribe( (resp: any) => {
      console.log('respuesta', resp);
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
      console.log(this.usuarios);
    });
  }
  cambiarDesde ( hacia: string, valor: number = this.paginacion ) {
    let desde;
    console.log(hacia, valor);
    if ( hacia === 'S') {
      console.log('Entra');
      desde = this.desde + valor;
    } else if ('A') {
      desde = this.desde - valor;
      console.log('Entra', this.desde);
    }
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }
    this.desde = desde;
    this.cargarUsuarios();
  }
  buscarUsuario( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this._segUsuarioService.buscarUsuarios(termino)
    .subscribe((usuarios: SegUsuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }
  desactivarUsuario ( usuario: SegUsuario ) {
    if (usuario.id_usuario === this._segUsuarioService.usuario.id_usuario) {
      Swal.fire('No puede desactivar usuario', 'No se puede desactivar a si mismo', 'error');
      return;
    }
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de desactivar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desactivar!'
    }).then((result) => {
      if (result.value) {
        this._segUsuarioService.desactivarUsuario(usuario.id_usuario)
        .subscribe( resp => {
            console.log(resp);
            this.cargarUsuarios();
            Swal.fire(
              'Desactivado!',
              'El usuario ha sido desactivado correctamente',
              'success'
            );
        });
      }
    });
  }
  mostrarModal(id_usuario: number) {
    this._modalUploadImagenService.mostrarModal('usuarios', id_usuario);
  }
}

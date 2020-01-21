import { Component, OnInit } from '@angular/core';
import { SegUsuarioService } from '../../services/service.index';
import { SegUsuario } from '../../models/segUsuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: SegUsuario;
  constructor(
    public _segUsuarioService: SegUsuarioService
  ) { }

  ngOnInit() {
    this.usuario = this._segUsuarioService.usuario;
  }

}

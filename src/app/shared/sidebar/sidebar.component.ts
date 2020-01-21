import { Component, OnInit } from '@angular/core';
import { SidebarService, SegUsuarioService } from '../../services/service.index';
import { SegUsuario } from '../../models/segUsuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: SegUsuario;
  constructor(
    public _sidebar: SidebarService,
    public _segUsuarioService: SegUsuarioService
  ) { }

  ngOnInit() {
    this.usuario = this._segUsuarioService.usuario;
  }
}

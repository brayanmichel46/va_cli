import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SegUsuarioService } from '../seg-usuario/seg-usuario.service';


@Injectable()
export class LoginGuardGuard implements CanActivate {

  constructor (
    public _serUsuarioService: SegUsuarioService,
    public router: Router
  ) {}

  canActivate() {
    if ( this._serUsuarioService.estaLogeado() ) {
      return true;
    } else {
      console.log('bloqueado por el guard');
      this.router.navigate(['/login']);
      return false;
    }
  }
}

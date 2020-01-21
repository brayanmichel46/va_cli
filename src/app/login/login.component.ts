import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SegUsuarioService } from '../services/service.index';
import { SegUsuario } from '../models/segUsuario.model';
import { element } from 'protractor';

declare function init_plugins();
declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  recuerdame: boolean = false;
  email: string;
  auth2: any;
  constructor(
    public router: Router,
    public _segUsuarioService: SegUsuarioService
  ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';

  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id : '59541194354-1lhpsv9dmdo82alir7oodssb70r8k6go.apps.googleusercontent.com',
        cookiepolicy : 'single_hiots_origin',
        scope: 'profile email'
      });
      this.attachSingin ( document.getElementById('btnGoogle'));
    });
  }

  // tslint:disable-next-line:no-shadowed-variable
  attachSingin( element ) {
    this.auth2.attachClickHandler ( element, {}, googleUser => {
      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;
      this._segUsuarioService.loginGoogle(token)
      .subscribe( () => window.location.href = '#/dashboard' );
      console.log(token);
    });
  }

  ingresar( forma: NgForm) {
    if ( forma.invalid ) {
      return;
    }
    let usuario = new SegUsuario(null, forma.value.email, forma.value.password);
    this._segUsuarioService.login(usuario, this.recuerdame)
    .subscribe(correcto => this.router.navigate(['/dashboard']));
  }
}

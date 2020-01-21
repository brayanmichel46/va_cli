import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SegUsuarioService } from '../services/service.index';
import { SegUsuario } from '../models/segUsuario.model';
import { GenPersona } from '../models/genPersona.model';
import { Router } from '@angular/router';

declare function init_plugins();
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  forma: FormGroup;
  constructor(
    public _segUsuarioService: SegUsuarioService,
    public router: Router
  ) { }

  ngOnInit() {
    init_plugins();
    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, {validators: this.sonIguales( 'password', 'password2')});
  }

  registrarUsuario() {
    if ( this.forma.invalid ) {
      return;
    }
    if ( !this.forma.value.condiciones ) {
      Swal(
        'Importante!',
        'Debe aceptar los teminos y condiciones',
        'warning'
      );
      return;
    }
    let usuario = new SegUsuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this._segUsuarioService.crearUsuario( usuario )
    .subscribe( resp => this.router.navigate(['/login']));
  }

  sonIguales(campo1: string, campo2: string) {
    return ( group: FormGroup ) => {
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;
      if (pass1 === pass2) {
        return null;
      }
      return {
        sonIguales: true
      };
    };
  }

}

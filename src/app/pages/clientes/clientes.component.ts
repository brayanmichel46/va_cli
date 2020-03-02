import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CliClienteService } from './../../services/cli-cliente/cli-cliente.service';
import { CliCliente } from './../../models/cli-cliente';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: CliCliente[] = [];
  desde: number = 0 ;
  totalRegistros: number = 0;
  paginacion: number = 5;
  cargando: boolean = false;
  banEditar:boolean =false;
  forma: FormGroup;
  constructor(
    public _cliClienteService: CliClienteService
  ) { }

  ngOnInit() {
    this.cargarClientes();
    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required)
      /* correo: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, {validators: this.sonIguales( 'password', 'password2') */});
  }

  cargarClientes(){
    this.cargando = true;
    this._cliClienteService.cargarClientes( this.desde )
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.clientes = resp.clientes;
        this.clientes.forEach(element => {
          element.ban_editar=false;
        });
      });
      this.cargando = false;
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
    this.cargarClientes();
  }

  buscarCliente( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarClientes();
      return;
    }
    this.cargando = true;
    this._cliClienteService.buscarClientes(termino)
    .subscribe((clientes: CliCliente[]) => {
      this.clientes = clientes;
      this.cargando = false;
    });
  }
  actualizarCliente(cliente:any){
    Swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de actualizar los datos del cliente: ' + cliente.identificacion,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!'
    }).then((result) => {
      if (result.value) {
        this._cliClienteService.actualizarCliente(cliente).subscribe((clientes: any) => {
          console.log("clientes",clientes);
          this.cargarClientes();
          Swal('¡Datos Actualizados!',"Cliente: " + cliente.identificacion, 'success');

        });
      }
    });
   /*  console.log(cliente);

    this._cliClienteService.actualizarCliente(cliente).subscribe((clientes: any) => {
      console.log("clientes",clientes);
      Swal('¡Datos Actualizados!',"Cliente: " + cliente.identificacion, 'success');
      //this.router.navigate(['/login']
    }); */
  }

/*   import { Injectable }    from '@angular/core';

@Injectable()
export class ValidatorService {

  esEmailValido(email: string):boolean {
    let mailValido = false;
      'use strict';

      var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (email.match(EMAIL_REGEX)){
        mailValido = true;
      }
    return mailValido;
  }
} */

}

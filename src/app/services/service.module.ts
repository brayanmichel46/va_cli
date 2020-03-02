import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
   SettingsService,
   SidebarService,
   SharedService,
   GenPersonaService,
   SegUsuarioService,
   LoginGuardGuard,
   SubirArchivoService,
   CliClienteService
} from './service.index';
import { ModalUploadImagenService } from '../components/modal-upload-imagen/modal-upload-imagen.service';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    GenPersonaService,
    SegUsuarioService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadImagenService,
    CliClienteService
  ],
  declarations: []
})
export class ServiceModule { }

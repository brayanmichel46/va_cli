import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ng2 - charts
import { ChartsModule } from 'ng2-charts';

import { PagesComponent } from './pages.component';
// pipe modulo
import { PipesModule } from '../pipes/pipes.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
// temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ModalUploadImagenComponent } from '../components/modal-upload-imagen/modal-upload-imagen.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FacturarComponent } from './facturar/facturar.component';
import { PaginationComponent } from '../components/pagination/pagination.component';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ListFacturasComponent } from './list-facturas/list-facturas.component';
import { MatrizMarqueteriaComponent } from './matriz-marqueteria/matriz-marqueteria.component';
import { ListPreciosComponent } from './list-precios/list-precios.component';

// fonts provided for pdfmake

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
    PagesComponent,
    IncrementadorComponent,
    GraficoDonaComponent,
    AccoutSettingsComponent,
    PromesasComponent,
    RxjsComponent,
    ProfileComponent,
    UsuariosComponent,
    ModalUploadImagenComponent,
    ClientesComponent,
    FacturarComponent,
    ListFacturasComponent,
    PaginationComponent,
    MatrizMarqueteriaComponent,
    ListPreciosComponent
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    PAGES_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    PipesModule,
    AutocompleteLibModule
  ]
})

export class PagesModule { }

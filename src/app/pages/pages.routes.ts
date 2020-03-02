import { FacturarComponent } from './facturar/facturar.component';
import { ClientesComponent } from './clientes/clientes.component';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { LoginGuardGuard } from '../services/service.index';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBars' } },
            { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Graficas' } },
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
            { path: 'account-settings', component: AccoutSettingsComponent, data: { titulo: 'Configuraciones' } },
            { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil' } },
            /**
            /* @description: Rutas de mantenimiento
            */
           { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios' } },
           { path: 'clientes', component: ClientesComponent, data: { titulo: 'clientes' } },
           /**
            /* @description: Rutas de ventas
            */
           { path: 'facturar', component: FacturarComponent, data: { titulo: 'Facturar' } },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild ( pagesRoutes );

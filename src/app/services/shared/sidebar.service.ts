import { Injectable } from '@angular/core';

@Injectable()
export class SidebarService {
  menu: any = [
    {
      titulo: 'Principal',
      icon: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'ProgressBar', url: '/progress' },
        { titulo: 'Graficas', url: '/graficas1' },
        { titulo: 'Promesas', url: '/promesas' },
        { titulo: 'Rxjs', url: '/rxjs' }
      ]
    },
    {
      titulo: 'Mantenimiento',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        { titulo: 'Usuarios', url: '/usuarios' },
        { titulo: 'Personas', url: '/personas' },
        { titulo: 'Clientes', url: '/clientes' }
      ]
    },
    {
      titulo: 'Ventas',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        { titulo: 'Facturar', url: '/facturar/-1' },
        { titulo: 'Listado Facturas', url: '/list-facturas' },
        { titulo: 'Listado Precios', url: '/list-precios' },
        { titulo: 'Matriz Marqueteria', url:'/matriz-marqueteria'}
      ]
    }
  ];
  constructor() { }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {
  titulo_vista: string = '';
  constructor(
    private router: Router,
    public title: Title,
    public meta: Meta
  ) {
    this.getDataRoute()
      .subscribe ( data => {
        this.titulo_vista = data.titulo;
        this.title.setTitle( 'VA ' + this.titulo_vista );
        let metaTag: MetaDefinition = {
          name: 'descripcion',
          content: this.titulo_vista
        };
        this.meta.updateTag(metaTag);
      });
  }
  ngOnInit() {
  }

  getDataRoute() {
    return this.router.events
      .filter ( evento => evento instanceof ActivationEnd )
      .filter ( (evento: ActivationEnd ) => evento.snapshot.firstChild === null )
      .map ( (evento: ActivationEnd) => evento.snapshot.data );
  }

}

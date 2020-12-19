import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { emit } from 'process';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() set numEle(n){
    console.log("cmabio",n);
  };
  @Input('numElePag') numElePag: number;
  @Output() cambiarPagina = new EventEmitter<number>();
  paginas: number[] = [];
  desde: number=0;
  constructor() { }

  ngOnInit(): void {
    this.inicializarPaginas();
    console.log("N ele ",this.numEle,"numElePag ", this.numElePag);
  }
  inicializarPaginas() {
    for (let i = 0; i < (this.numEle / this.numElePag); i++) {
      this.paginas.push(i);
    }
  }
  onCambiarPagina(desde) {
    this.desde = desde;
    console.log("nuevo desde ",this.desde);
    this.cambiarPagina.emit(this.desde);
  }
  siguiente() {
    console.log("siguiente23333",this.desde);
    let desde = this.desde + this.numElePag;
    console.log("siguiente",desde);
    if (desde > this.numEle-this.numElePag) { return; }
    this.onCambiarPagina(desde);
  }
  anterior() {
    let desde = this.desde - this.numElePag;
    console.log("anterior ",desde, this.desde,this.numElePag);
    if (desde < 0) { return; }
    this.onCambiarPagina(desde);
  }

}

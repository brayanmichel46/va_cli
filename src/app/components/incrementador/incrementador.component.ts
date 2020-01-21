import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;
  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();
  constructor() {
    console.log( 'leyenda', this.leyenda );
    console.log( 'progreso', this.progreso );
  }

  ngOnInit() {
  }
  cambiarValor( valor: number ) {
    if ( this.progreso >= 100 && valor > 0 ) {
      return;
    } else if ( this.progreso <= 0 && valor < 0 ) {
      return;
    } else {
      this.progreso += valor;
      this.cambioValor.emit(this.progreso);
      this.txtProgress.nativeElement.focus();
    }
  }

  onChange( newValue: number) {
    // let elemHTML: any = document.getElementsByName('progreso')[0];
    // console.log('new value', newValue);
    if ( newValue >= 100 ) {
      this.progreso = 100;
    } else if ( newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }
    this.txtProgress.nativeElement.value = Number (this.progreso);
    this.cambioValor.emit(this.progreso);
  }
}

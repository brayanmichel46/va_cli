import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css']
})
export class FacturarComponent implements OnInit {
  model: any;
  constructor() { }

  ngOnInit() {
  }

  keyword = 'name';
  data = [
    {
      id: 1,
      name: 'Usa'
    },
    {
      id: 2,
      name: 'England'
    }
  ];


  selectEvent(item) {
    // do something with selected item
    console.log("hola");
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log("hola");
  }

  onFocused(e) {
    // do something when input is focused
  }


}

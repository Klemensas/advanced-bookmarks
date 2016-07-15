import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'create-card',
  templateUrl: 'create-card.component.html',
  styleUrls: ['create-card.component.css']
})
export class CreateCardComponent implements OnInit {
  model = {
      name: '',
      description: '',
      url: ''
  }
  constructor() { console.log('constr call')}

  ngOnInit() {

    console.log('ho?')
  }

  cardSubmit(ev) {
      console.log(ev.path);
      return 'wtf';
  }

  test() {
    console.log('i run test')
  }

}

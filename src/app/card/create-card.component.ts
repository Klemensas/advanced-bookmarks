import { Component, OnInit } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'create-card',
  templateUrl: 'create-card.component.html',
  styleUrls: ['create-card.component.css'],
  directives: [NgClass]
})
export class CreateCardComponent implements OnInit {
  isActive = false;
  model = {
      name: '',
      url: ''
  }
  constructor() {}

  ngOnInit() {
  }

  addCard(ev) {
      this.isActive = true;
      console.log(ev, this);
  }

}

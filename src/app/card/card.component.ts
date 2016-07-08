import { Component, OnInit } from '@angular/core';
// import { ConfigurationService } from '../services/configuration.service';

@Component({
  moduleId: module.id,
  selector: 'card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css'],
  inputs: ['item']
})
export class CardComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {

  }

}

import { Component, OnInit } from '@angular/core';
// import { ConfigurationService } from '../services/configuration.service';
import globals = require('../globals');

@Component({
  moduleId: module.id,
  selector: 'card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css'],
  inputs: ['group', 'groupName']
})
export class CardComponent implements OnInit {
    groupName
  constructor(/*group: groupName*/) {
      // console.log(this.group)
  }

  ngOnInit() {
  }

  cardScreen(card) {
    // TODO: handle noscreenshot scenario
    if (card.screenshot) {
      return globals.backend + card.screenshot;
    } else {
      return;
    }
  }

  removeCard(card) {
    // TODO: actually remove
    console.log('goodbye', card)
  }

}

import { Component, OnInit } from '@angular/core';
// import { ConfigurationService } from '../services/configuration.service';

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
      if (card.screen) {
          return `//localhost:3000/static/${this.groupName}/${card.name}.png`;
      }
      return './placeholder.png'
  }

}

import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { DataService } from '../services/index';
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
  group;
  groupName;
  cardListener;
  constructor(private ds: DataService, private elementRef: ElementRef, private renderer: Renderer) {
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
    if (card.remove) {
       this.ds.removeCard(card, this.groupName)
    }
  }

  focus(group) {
    if (this.group.length > 1) {
      this.cardListener = this.renderer.listenGlobal('document', 'keydown', e => {
        switch(e.keyCode) {
          case 37:
            this.navigate('prev');
          break;
          case 39:
            this.navigate('next');
          break;
        }
      });
    }
  }

  loseFocus(group) {
    if (typeof this.cardListener === 'function') {
      this.cardListener();
    }
  }

  navigate(direction) {
    if (direction === 'next') {
      this.group.splice(this.group.length, 0, this.group.splice(0, 1)[0]);
    } else {
      this.group.splice(0, 0, this.group.splice(-1, 1)[0]);
    }
    setTimeout(() => {
      this.renderer.invokeElementMethod(
        this.elementRef.nativeElement.querySelector('.card'), 'focus', []);
    })
  }
}

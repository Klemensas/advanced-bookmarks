import { Component, OnInit, ElementRef } from '@angular/core';
import { DataService } from '../services/index';


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
      url: '',
      tag: ''
  };
  keep = false;
  active = true; // used for custom reset, until implemented

  toggler; // In hindsight - I shouldn't have used css modal if I wanted to use js on it, oh well...
  close;

  constructor(private ds: DataService, private elementRef: ElementRef) {
  }

  ngOnInit() {
    // This hurts my face
    this.toggler = this.elementRef.nativeElement.firstElementChild;
    this.close = this.elementRef.nativeElement.querySelector('.close');

    if (window.location.hash === '#create-card') {
      this.toggler.click();
    }
  }


  cardSubmit(cardForm) {
    if (cardForm.valid) {
      this.active = false;
      this.ds.createCard(cardForm.value)
        .then(data => {
          Object.keys(this.model).forEach(c => this.model[c] = '');
          setTimeout(() => this.active = true, 0);
        })
        if (!this.keep) {
          this.close.click();
        }
    }
  }

}

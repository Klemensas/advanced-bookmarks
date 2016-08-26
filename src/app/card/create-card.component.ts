// TODO: This must become an angular modal component initialized again on every call, it's this or listening for server/local change
// Angular2 has no one-time binding, regarding: image grab url inheritance from address
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
      desc: '',
      address: [{
        url: '',
        comment: ''
      }],
      urlComment: '',
      tag: '',
      image: {}
  };
  modelInit = Object.assign({}, this.model);
  advanced = 'false';
  keep = false;
  usesServer = false;
  active = true; // used for custom reset, until implemented

  /*TODO: follow https://github.com/angular/angular/issues/7393
  validation is done by custom validators or by regex patterns.
  I don't want to build my own custom validator for this one case.
  Currently the below pattern is added directly to the template
  because it doesn't allow to bind an expression correctly. 
  */
  urlPattern = /^https?:\/\/(www.)?[^\/$\s].+/;

  toggler; // In hindsight - I shouldn't have used css modal if I wanted to use js on it, oh well...
  close;

  constructor(private ds: DataService, private elementRef: ElementRef) {
    this.usesServer = ds.fromServer;
  }

  ngOnInit() {
    // This hurts my face
    this.toggler = this.elementRef.nativeElement.firstElementChild;
    this.close = this.elementRef.nativeElement.querySelector('.close');

    if (window.location.hash === '#create-card') {
      this.toggler.click();
    }
  }

  addAddress(model) {
    model.address.push({
      url: '',
      comment: ''
    });
  }

  cardSubmit(cardForm) {
    if (cardForm.valid) {
      this.active = false;
      this.ds.createCard(this.model)
        .then(data => {
          this.model = this.modelInit;
          setTimeout(() => this.active = true, 0);
        })
        if (!this.keep) {
          this.close.click();
        }
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { SourceSelectComponent } from '../source-select/source-select.component';
import { CreateCardComponent } from '../card/index';

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
  directives: [SourceSelectComponent, CreateCardComponent]
})
export class NavbarComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}

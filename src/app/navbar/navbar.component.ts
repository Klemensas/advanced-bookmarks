import { Component, OnInit } from '@angular/core';
import { SourceSelectComponent } from '../source-select/source-select.component';

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
  directives: [SourceSelectComponent]
})
export class NavbarComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}

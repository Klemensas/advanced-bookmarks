import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../services/index';

@Component({
  moduleId: module.id,
  selector: 'source-select',
  templateUrl: 'source-select.component.html',
  styleUrls: ['source-select.component.css'],
})
export class SourceSelectComponent implements OnInit {
  public fromServer: boolean;

  constructor(private cs: ConfigurationService) {}

  ngOnInit() {
    this.cs.config.subscribe(
      config => { console.log(config); this.fromServer = config['fromServer'] }, // must use config['fromServer'], if trying config.fromServer typescript gives an error
      error => console.error(error)
    );
  }

  storageChange(a) {
      this.fromServer = !this.fromServer;
      this.cs.setConfiguration({ fromServer: this.fromServer });
  }
}

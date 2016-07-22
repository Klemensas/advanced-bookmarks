import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { CardComponent } from './card/index';
import { ConfigurationService, DataService } from './services/index';

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'links.component.html',
  styleUrls: ['links.component.css'],
  directives: [NavbarComponent, CardComponent]
})
export class LinksAppComponent {
    public cards = {};
    public cardGroups = [];

    constructor(private configService: ConfigurationService, private dataService: DataService) {}

    ngOnInit() {
        this.dataService.data.subscribe(
            c => {
              console.log('get cards', c)
              this.cards = c
              this.cardGroups = Object.keys(this.cards)
            },
            error => console.error(error),
            () => console.error('UH OH, I SHOULD NEVER HAPPEN')
        );
    }
}

import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { CardComponent, CreateCardComponent } from './card/index';
import { ConfigurationService, DataService } from './services/index';

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'links.component.html',
  styleUrls: ['links.component.css'],
  directives: [NavbarComponent, CardComponent, CreateCardComponent]
})
export class LinksAppComponent {
    public cards = [];

    constructor(private configService: ConfigurationService, private dataService: DataService) {
        console.log('hohoh');
    }

    ngOnInit() {
        this.dataService.data.subscribe(
            c => this.cards = c,
            error => console.error(error),
            () => console.error('UH OH, I SHOULD NEVER HAPPEN')
        );
    }
}

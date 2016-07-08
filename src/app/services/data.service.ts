import { Injectable } from '@angular/core';
import { ConfigurationService } from './index';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
    public data = new BehaviorSubject([]); 

    constructor(private configService: ConfigurationService) {
        const fromServer = configService.config.fromServer;
        if (!fromServer) {
            this.loadLocalData();
        this.inserLocalData({ name: 'kebab', url: 'https://google.com' })
            return;
        }
        this.loadServerData();
    }

    loadLocalData() {
        const stored = JSON.parse(localStorage.getItem('storedData')) || [];
        this.data.next(stored);
    }

    inserLocalData(data) {
        const stored = JSON.parse(localStorage.getItem('storedData')) || [];
        JSON.stringify(stored.push(data));
        localStorage.setItem('storedData', JSON.stringify(stored));
        // This should be handled by the component I guess?
        this.data.next(stored);
    }

    loadServerData() { /* I AM A STUB */}

}

/// <reference path="../../../typings/EventSource.d.ts"/>
import { Injectable } from '@angular/core';
import { ConfigurationService } from './index';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http/*, Response*/ } from '@angular/http';

@Injectable()
export class DataService {
    private fromServer: boolean;
    private serverStream: EventSource;

    public data = new BehaviorSubject([]);

    constructor(private cs: ConfigurationService, private http: Http) {
        this.cs.config.subscribe(
            config => this.configUpdate(config),
            error => console.error(error)
        );
        // this.insertLocalData({ name: 'kebab', url: 'https://google.com' })
    }

    configUpdate(config) {
        if (this.fromServer !== config.fromServer || !this.fromServer === undefined) {
            if (this.serverStream) {
                this.serverStream.close();
            }
            
            this.fromServer = config.fromServer;
            this.fromServer ? this.loadServerData() : this.loadLocalData();
        }
    }

    loadLocalData() {
        console.log('load local')
        const stored = JSON.parse(localStorage.getItem('storedData')) || [];
        console.log(stored);
        this.data.next(stored);
    }

    insertLocalData(data) {
        const stored = JSON.parse(localStorage.getItem('storedData')) || [];
        JSON.stringify(stored.push(data));
        localStorage.setItem('storedData', JSON.stringify(stored));
        // This should be handled by the component I guess?
        this.data.next(stored);
    }

    loadServerData() {
        this.serverStream = new EventSource('http://192.168.111.200:3000/api/streamCards');
        this.serverStream.addEventListener('message', (d) => {
            const data = JSON.parse(d.data);
            this.data.next(data);
       })
        // this.http.get('http://192.168.111.200:3000/api/streamCards')
        console.log('load server')
    }

}

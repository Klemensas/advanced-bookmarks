/// <reference path="../../../typings/EventSource.d.ts"/>
import { Injectable } from '@angular/core';
import { ConfigurationService } from './index';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
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
        return new Promise((resolve, reject) => {
            const stored = JSON.parse(localStorage.getItem('storedData')) || [];
            JSON.stringify(stored.push(data));
            localStorage.setItem('storedData', JSON.stringify(stored));
            // This should be handled by the component I guess?
            this.data.next(stored);
            resolve('ok');
        });
    }

    loadServerData() {
        this.serverStream = new EventSource('http://192.168.111.200:3000/api/streamCards');
        this.serverStream.addEventListener('cards', (d) => {
            const data = JSON.parse(d.data);
            this.data.next(data);
       })
        this.serverStream.addEventListener('card', (d) => {
            const newCard = JSON.parse(d.data);
            const cardGroup = Object.keys(newCard)[0];
            const currentCards = this.data.getValue();
            const targetGroup = currentCards[cardGroup] || [];
            currentCards[cardGroup] = targetGroup.concat(newCard[cardGroup]);
            this.data.next(currentCards);
       })
        this.serverStream.addEventListener('screenshot', (d) => {
            const newScreen = JSON.parse(d.data);
            const group = Object.keys(newScreen)[0];
            const currentCards = this.data.getValue();
            const target = currentCards[group].find(c => c.id === newScreen[group].id);
            target.screen = true;
            this.data.next(currentCards);
       })
    }

    createCard(data) {
        return this.fromServer ? this.postCard(data) : this.insertLocalData(data);
    }

    postCard(data) {
        return this.http.post('http://192.168.111.200:3000/api/cards/add', data)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }

    private extractData(res) {
      let body = res.text();
      return body.data || { };
    }

    private handleError (error: any) {
      // In a real world app, we might use a remote logging infrastructure
      // We'd also dig deeper into the error to get a better message
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
    }

}

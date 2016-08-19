/// <reference path="../../../typings/EventSource.d.ts"/>
import { Injectable } from '@angular/core';
import { ConfigurationService } from './index';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import { backend } from '../globals';
import { Http/*, Response*/ } from '@angular/http';
@Injectable()
export class DataService {
    private serverStream: EventSource;

    public fromServer: boolean;
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
        const stored = JSON.parse(localStorage.getItem('storedData')) || {};
        console.log(stored);
        this.data.next(stored);
    }

    insertLocalData(data) {
        return new Promise((resolve, reject) => {
            let stored = JSON.parse(localStorage.getItem('storedData')) || {};
            stored = this.updateStored(stored, data);
            // JSON.stringify(stored);
            localStorage.setItem('storedData', JSON.stringify(stored));
            // This should be handled by the component I guess?
            this.data.next(stored);
            resolve('ok');
        });
    }

    loadServerData() {
       this.serverStream = new EventSource(`${backend}api/streamCards`);
        this.serverStream.addEventListener('cards', (d) => {
            const data = JSON.parse(d.data);
            this.data.next(data);
       })
        this.serverStream.addEventListener('card', (d) => {
            const data = JSON.parse(d.data);
            const card = data.card;
            const group = data.tag;
            const event = data.event;
            this.updateCard(card, group, event);
       })
    }

    updateCard(card, group, event) {
        const currentCards = this.data.getValue();
        const targetGroup = currentCards[group] || [];
        const index = targetGroup.findIndex(i => i.id === card.id);
        if (event === 'remove') {
            currentCards[group].splice(index, 1);
            if (!currentCards[group].length) {
                delete currentCards[group];
            }
        } else {
            if (index !== -1) {
                targetGroup[index] = card;
            } else {
                currentCards[group] = targetGroup.concat(card);
            }
        }
        console.log(currentCards);
        this.data.next(currentCards);
    }

    createCard(data) {
        return this.fromServer ? this.postCard(data) : this.insertLocalData(data);
    }

    postCard(data) {
        return this.http.post(`${backend}api/cards/add`, data)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }

    removeCard(card, group) {
        return this.http.delete(`${backend}api/cards/${group}/${card.id}`)
            .toPromise()
            .then(this.extractData)
            .then(d => console.log('del done', d))
            .catch(this.handleError)
    }

    private updateStored(stored, data) {
        const tag = data.tag;
        delete data.tag;
        console.log(stored, tag, data)
        if (!stored[tag]) {
            stored[tag] = [];
        }
        stored[tag].push(data);
        return stored;
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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ConfigurationService {
    private currentConfig = {};

    public defaultConfig = { fromServer: true };
    public config = new BehaviorSubject(<Object>this.defaultConfig);

    constructor() {
        this.currentConfig = Object.assign({}, this.defaultConfig, this.getConfiguration());
        this.config.next(this.currentConfig);
        console.log('config gotten', this.currentConfig)
    }

    getConfiguration() {
        return JSON.parse(localStorage.getItem('configuration'));
    }

    setConfiguration(data) {
        this.currentConfig = Object.assign({}, this.defaultConfig, data);
        localStorage.setItem('configuration', JSON.stringify(this.currentConfig));
        this.config.next(this.currentConfig);
    }
}

import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {
    public config = {
        fromServer: true
    };
  
    constructor() {
        this.config = Object.assign(this.config, this.getConfiguration());
        console.log('config gotten', this.config)
    }

    getConfiguration() {
        return JSON.parse(localStorage.getItem('configuration'));
    }

    setConfiguration(data) {
        // Override data with set data
        this.config = Object.assign(this.config, data);
        console.log('set config to', this.config);
        localStorage.setItem('configuration', JSON.stringify(this.config));
    }
}

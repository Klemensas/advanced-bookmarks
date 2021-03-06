import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { LinksAppComponent, environment } from './app/';
import { ConfigurationService, DataService } from './app/services/index';

if (environment.production) {
  enableProdMode();
} else {
    localStorage.removeItem('storedData');
    // localStorage.removeItem('configuration');    
}
bootstrap(LinksAppComponent, [
    disableDeprecatedForms(),
    provideForms(),
    HTTP_PROVIDERS,
    ConfigurationService,
    DataService,
]);

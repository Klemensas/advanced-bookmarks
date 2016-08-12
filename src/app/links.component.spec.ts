import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { LinksAppComponent } from '../app/links.component';

beforeEachProviders(() => [LinksAppComponent]);

describe('App: Links', () => {
  // it('should create the app',
  //     inject([LinksAppComponent], (app: LinksAppComponent) => {
  //   expect(app).toBeTruthy();
  // }));

  // it('should have as title \'links works!\'',
  //     inject([LinksAppComponent], (app: LinksAppComponent) => {
  //   expect(app.title).toEqual('links works!');
  // }));
});

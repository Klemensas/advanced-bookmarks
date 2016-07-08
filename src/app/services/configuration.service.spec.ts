import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';

describe('Configuration Service', () => {
  beforeEachProviders(() => [ConfigurationService]);

  it('should ...',
      inject([ConfigurationService], (service: ConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});

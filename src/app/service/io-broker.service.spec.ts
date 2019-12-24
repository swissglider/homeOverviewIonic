import { TestBed } from '@angular/core/testing';

import { IOBrokerService } from './io-broker.service';

describe('IoBrokerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IOBrokerService = TestBed.get(IOBrokerService);
    expect(service).toBeTruthy();
  });
});

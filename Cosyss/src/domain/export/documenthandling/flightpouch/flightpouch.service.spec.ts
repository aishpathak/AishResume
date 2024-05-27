import { TestBed, inject } from '@angular/core/testing';

import { FlightpouchService } from './flightpouch.service';

describe('FlightpouchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlightpouchService]
    });
  });

  it('should be created', inject([FlightpouchService], (service: FlightpouchService) => {
    expect(service).toBeTruthy();
  }));
});

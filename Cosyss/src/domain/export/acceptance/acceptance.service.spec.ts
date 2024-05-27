/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AcceptanceService } from './acceptance.service';

describe('Service: Acceptance', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcceptanceService]
    });
  });

  it('should ...', inject([AcceptanceService], (service: AcceptanceService) => {
    expect(service).toBeTruthy();
  }));
});

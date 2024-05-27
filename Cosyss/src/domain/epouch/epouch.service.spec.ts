/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EpouchService } from './epouch.service';

describe('Service: Epouch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EpouchService]
    });
  });

  it('should ...', inject([EpouchService], (service: EpouchService) => {
    expect(service).toBeTruthy();
  }));
});

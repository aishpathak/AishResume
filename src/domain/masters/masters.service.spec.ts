/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MastersService } from './masters.service';

describe('Service: Masters', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MastersService]
    });
  });

  it('should ...', inject([MastersService], (service: MastersService) => {
    expect(service).toBeTruthy();
  }));
});
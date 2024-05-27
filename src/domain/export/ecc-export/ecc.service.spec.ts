/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EccService } from './ecc.service';

describe('Service: Ecc', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EccService]
    });
  });

  it('should ...', inject([EccService], (service: EccService) => {
    expect(service).toBeTruthy();
  }));
});
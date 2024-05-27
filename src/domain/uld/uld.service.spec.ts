/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UldService } from './uld.service';

describe('Service: Uld', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UldService]
    });
  });

  it('should ...', inject([UldService], (service: UldService) => {
    expect(service).toBeTruthy();
  }));
});

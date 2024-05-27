/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OuthouseService } from './outhouse.service';

describe('Service: Outhouse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OuthouseService]
    });
  });

  it('should ...', inject([OuthouseService], (service: OuthouseService) => {
    expect(service).toBeTruthy();
  }));
});

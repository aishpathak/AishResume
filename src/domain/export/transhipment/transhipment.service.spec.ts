/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TranshipmentService } from './transhipment.service';

describe('Service: Transhipment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranshipmentService]
    });
  });

  it('should ...', inject([TranshipmentService], (service: TranshipmentService) => {
    expect(service).toBeTruthy();
  }));
});

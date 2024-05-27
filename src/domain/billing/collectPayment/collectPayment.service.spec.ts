/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CollectPaymentService } from './collectPayment.service';

describe('Service: CollectPayment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectPaymentService]
    });
  });

  it('should ...', inject([CollectPaymentService], (service: CollectPaymentService) => {
    expect(service).toBeTruthy();
  }));
});

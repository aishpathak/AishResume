import { TestBed, inject } from '@angular/core/testing';

import { InboundShipmentService } from './inbound-shipment.service';

describe('InboundShipmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InboundShipmentService]
    });
  });

  it('should be created', inject([InboundShipmentService], (service: InboundShipmentService) => {
    expect(service).toBeTruthy();
  }));
});

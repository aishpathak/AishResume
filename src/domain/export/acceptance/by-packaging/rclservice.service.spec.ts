import { TestBed, inject } from '@angular/core/testing';

import { RclserviceService } from './rclservice.service';

describe('RclserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RclserviceService]
    });
  });

  it('should be created', inject([RclserviceService], (service: RclserviceService) => {
    expect(service).toBeTruthy();
  }));
});

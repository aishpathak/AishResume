import { TestBed, inject } from '@angular/core/testing';

import { TCSServiceService } from './tcsservice.service';

describe('TCSServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TCSServiceService]
    });
  });

  it('should be created', inject([TCSServiceService], (service: TCSServiceService) => {
    expect(service).toBeTruthy();
  }));
});

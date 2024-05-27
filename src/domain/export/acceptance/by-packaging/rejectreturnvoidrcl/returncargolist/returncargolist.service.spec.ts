import { TestBed, inject } from '@angular/core/testing';

import { ReturncargolistService } from './returncargolist.service';

describe('ReturncargolistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReturncargolistService]
    });
  });

  it('should be created', inject([ReturncargolistService], (service: ReturncargolistService) => {
    expect(service).toBeTruthy();
  }));
});

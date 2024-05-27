import { TestBed, inject } from '@angular/core/testing';

import { BuplistService } from './buplist.service';

describe('BuplistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuplistService]
    });
  });

  it('should be created', inject([BuplistService], (service: BuplistService) => {
    expect(service).toBeTruthy();
  }));
});

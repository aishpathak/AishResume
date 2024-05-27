import { TestBed, inject } from '@angular/core/testing';

import { PresortingService } from './presorting.service';

describe('PresortingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PresortingService]
    });
  });

  it('should be created', inject([PresortingService], (service: PresortingService) => {
    expect(service).toBeTruthy();
  }));
});

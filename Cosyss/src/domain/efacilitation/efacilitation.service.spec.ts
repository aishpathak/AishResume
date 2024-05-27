import { TestBed, inject } from '@angular/core/testing';

import { EfacilitationService } from './efacilitation.service';

describe('EfacilitationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EfacilitationService]
    });
  });

  it('should be created', inject([EfacilitationService], (service: EfacilitationService) => {
    expect(service).toBeTruthy();
  }));
});

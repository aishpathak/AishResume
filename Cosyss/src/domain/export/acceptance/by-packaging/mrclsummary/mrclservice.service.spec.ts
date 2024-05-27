import { TestBed, inject } from '@angular/core/testing';

import { MrclserviceService } from './mrclservice.service';

describe('MrclserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MrclserviceService]
    });
  });

  it('should be created', inject([MrclserviceService], (service: MrclserviceService) => {
    expect(service).toBeTruthy();
  }));
});

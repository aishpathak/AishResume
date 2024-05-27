import { TestBed, inject } from '@angular/core/testing';

import { TcsService } from './tcs.service';

describe('TcsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TcsService]
    });
  });

  it('should be created', inject([TcsService], (service: TcsService) => {
    expect(service).toBeTruthy();
  }));
});

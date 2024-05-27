import { TestBed, inject } from '@angular/core/testing';

import { TranshipmentService } from './transhipment.service';

describe('TranshipmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranshipmentService]
    });
  });

  it('should be created', inject([TranshipmentService], (service: TranshipmentService) => {
    expect(service).toBeTruthy();
  }));
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DangerousgoodsService } from './dangerousgoods.service';

describe('Service: Dangerousgoods', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DangerousgoodsService]
    });
  });

  it('should ...', inject([DangerousgoodsService], (service: DangerousgoodsService) => {
    expect(service).toBeTruthy();
  }));
});
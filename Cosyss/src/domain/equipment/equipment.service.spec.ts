/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EquipmentService } from './equipment.service';

describe('Service: Equipment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquipmentService]
    });
  });

  it('should ...', inject([EquipmentService], (service: EquipmentService) => {
    expect(service).toBeTruthy();
  }));
});
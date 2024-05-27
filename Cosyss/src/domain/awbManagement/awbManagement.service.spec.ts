/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AwbManagementService } from './awbManagement.service';

describe('Service: AwbManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AwbManagementService]
    });
  });

  it('should ...', inject([AwbManagementService], (service: AwbManagementService) => {
    expect(service).toBeTruthy();
  }));
});
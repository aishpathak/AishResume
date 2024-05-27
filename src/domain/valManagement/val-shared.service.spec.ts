import { TestBed, inject } from '@angular/core/testing';
import { BaseResponse, RestService, HTTPService, BaseService } from 'ngc-framework';
import { ValSharedService } from './val-shared.service';

describe('ValSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValSharedService , RestService, HTTPService, BaseService]
    });
  });

  it('should be created', inject([ValSharedService], (service: ValSharedService) => {
    expect(service).toBeTruthy();
  }));
});

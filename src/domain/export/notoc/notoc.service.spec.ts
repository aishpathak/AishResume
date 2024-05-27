/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotocService } from './notoc.service';

describe('Service: Notoc', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotocService]
    });
  });

  it('should ...', inject([NotocService], (service: NotocService) => {
    expect(service).toBeTruthy();
  }));
});
import { CheckListService } from './check-list.service';
import { TestBed, async, inject } from '@angular/core/testing';

describe('Service: CheckList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckListService]
    });
  });

  it('should ...', inject([CheckListService], (service: CheckListService) => {
    expect(service).toBeTruthy();
  }));
});
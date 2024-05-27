import { TestBed, inject } from '@angular/core/testing';

import { MrclpredeclarationService } from './mrclpredeclaration.service';

describe('MrclpredeclarationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MrclpredeclarationService]
    });
  });

  it('should be created', inject([MrclpredeclarationService], (service: MrclpredeclarationService) => {
    expect(service).toBeTruthy();
  }));
});

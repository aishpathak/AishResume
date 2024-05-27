import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddocumentComponent } from './adddocument.component';

describe('AdddocumentComponent', () => {
  let component: AdddocumentComponent;
  let fixture: ComponentFixture<AdddocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdddocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

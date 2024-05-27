import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FwbDataValidationComponent } from './fwb-datavalidation.component';

describe('FwbDataValidationComponent', () => {
  let component: FwbDataValidationComponent;
  let fixture: ComponentFixture<FwbDataValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FwbDataValidationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FwbDataValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitBreakdownDiscrepancyComponent } from './submit-breakdown-discrepancy.component';

describe('SubmitBreakdownDiscrepancyComponent', () => {
  let component: SubmitBreakdownDiscrepancyComponent;
  let fixture: ComponentFixture<SubmitBreakdownDiscrepancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitBreakdownDiscrepancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitBreakdownDiscrepancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

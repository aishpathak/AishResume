import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReconciliationErrordetailsComponent } from './submit-reconciliation-errordetails.component';

describe('SubmitReconciliationErrordetailsComponent', () => {
  let component: SubmitReconciliationErrordetailsComponent;
  let fixture: ComponentFixture<SubmitReconciliationErrordetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitReconciliationErrordetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReconciliationErrordetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

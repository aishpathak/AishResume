import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReconciliationErrorComponent } from './submit-reconciliation-error.component';

describe('SubmitReconciliationErrorComponent', () => {
  let component: SubmitReconciliationErrorComponent;
  let fixture: ComponentFixture<SubmitReconciliationErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitReconciliationErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReconciliationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

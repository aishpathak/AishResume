import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReconciliationHistoryComponent } from './submit-reconciliation-history.component';

describe('SubmitReconciliationHistoryComponent', () => {
  let component: SubmitReconciliationHistoryComponent;
  let fixture: ComponentFixture<SubmitReconciliationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitReconciliationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReconciliationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

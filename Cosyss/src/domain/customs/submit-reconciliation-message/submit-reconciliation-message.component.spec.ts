import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReconciliationMessageComponent } from './submit-reconciliation-message.component';

describe('SubmitReconciliationMessageComponent', () => {
  let component: SubmitReconciliationMessageComponent;
  let fixture: ComponentFixture<SubmitReconciliationMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitReconciliationMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReconciliationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

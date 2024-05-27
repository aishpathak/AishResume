import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReconciliationComponent } from './submit-reconciliation.component';

describe('SubmitReconciliationComponent', () => {
  let component: SubmitReconciliationComponent;
  let fixture: ComponentFixture<SubmitReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByBillingComponent } from './audit-trail-by-billing.component';

describe('AuditTrailByBillingComponent', () => {
  let component: AuditTrailByBillingComponent;
  let fixture: ComponentFixture<AuditTrailByBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditTrailByBillingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

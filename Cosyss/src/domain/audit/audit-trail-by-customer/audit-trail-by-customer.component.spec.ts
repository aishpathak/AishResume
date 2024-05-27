import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByCustomerComponent } from './audit-trail-by-customer.component';

describe('AuditTrailByCustomerComponent', () => {
  let component: AuditTrailByCustomerComponent;
  let fixture: ComponentFixture<AuditTrailByCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

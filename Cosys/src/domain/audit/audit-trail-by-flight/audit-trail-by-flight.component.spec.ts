import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByFlightComponent } from './audit-trail-by-flight.component';

describe('AuditTrailByFlightComponent', () => {
  let component: AuditTrailByFlightComponent;
  let fixture: ComponentFixture<AuditTrailByFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

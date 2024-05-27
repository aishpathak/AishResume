import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByTracingComponent } from './audit-trail-by-tracing.component';

describe('AuditTrailByTracingComponent', () => {
  let component: AuditTrailByTracingComponent;
  let fixture: ComponentFixture<AuditTrailByTracingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByTracingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

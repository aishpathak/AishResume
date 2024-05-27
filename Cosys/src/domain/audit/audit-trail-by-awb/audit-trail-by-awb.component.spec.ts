import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByAwbComponent } from './audit-trail-by-awb.component';

describe('AuditTrailByAwbComponent', () => {
  let component: AuditTrailByAwbComponent;
  let fixture: ComponentFixture<AuditTrailByAwbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditTrailByAwbComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByAwbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

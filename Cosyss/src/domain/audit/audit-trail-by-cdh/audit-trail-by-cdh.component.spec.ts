import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByCdhComponent } from './audit-trail-by-cdh.component';

describe('AuditTrailByCdhComponent', () => {
  let component: AuditTrailByCdhComponent;
  let fixture: ComponentFixture<AuditTrailByCdhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByCdhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByCdhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

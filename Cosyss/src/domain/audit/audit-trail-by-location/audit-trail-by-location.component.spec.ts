import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByLocationComponent } from './audit-trail-by-location.component';

describe('AuditTrailByLocationComponent', () => {
  let component: AuditTrailByLocationComponent;
  let fixture: ComponentFixture<AuditTrailByLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

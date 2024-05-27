import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByMailbagComponent } from './audit-trail-by-mailbag.component';

describe('AuditTrailByMailbagComponent', () => {
  let component: AuditTrailByMailbagComponent;
  let fixture: ComponentFixture<AuditTrailByMailbagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByMailbagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByMailbagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

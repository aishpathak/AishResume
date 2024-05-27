import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByUldComponent } from './audit-trail-by-uld.component';

describe('AuditTrailByUldComponent', () => {
  let component: AuditTrailByUldComponent;
  let fixture: ComponentFixture<AuditTrailByUldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByUldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByUldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

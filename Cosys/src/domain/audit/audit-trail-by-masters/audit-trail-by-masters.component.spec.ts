import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByMastersComponent } from './audit-trail-by-masters.component';

describe('AuditTrailByMastersComponent', () => {
  let component: AuditTrailByMastersComponent;
  let fixture: ComponentFixture<AuditTrailByMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByEfacilitationComponent } from './audit-trail-by-efacilitation.component';

describe('AuditTrailByEfacilitationComponent', () => {
  let component: AuditTrailByEfacilitationComponent;
  let fixture: ComponentFixture<AuditTrailByEfacilitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByEfacilitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByEfacilitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

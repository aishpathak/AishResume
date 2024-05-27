import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByCustomsComponent } from './audit-trail-by-customs.component';

describe('AuditTrailByCustomsComponent', () => {
  let component: AuditTrailByCustomsComponent;
  let fixture: ComponentFixture<AuditTrailByCustomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByCustomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByCustomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

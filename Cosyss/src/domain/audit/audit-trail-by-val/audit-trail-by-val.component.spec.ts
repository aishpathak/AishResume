import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByValComponent } from './audit-trail-by-val.component';

describe('AuditTrailByValComponent', () => {
  let component: AuditTrailByValComponent;
  let fixture: ComponentFixture<AuditTrailByValComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByValComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

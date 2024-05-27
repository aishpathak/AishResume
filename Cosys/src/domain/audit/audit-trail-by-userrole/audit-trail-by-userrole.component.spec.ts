import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByUserroleComponent } from './audit-trail-by-userrole.component';

describe('AuditTrailByUserroleComponent', () => {
  let component: AuditTrailByUserroleComponent;
  let fixture: ComponentFixture<AuditTrailByUserroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByUserroleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByUserroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

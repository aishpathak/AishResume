import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByAgentComponent } from './audit-trail-by-agent.component';

describe('AuditTrailByAgentComponent', () => {
  let component: AuditTrailByAgentComponent;
  let fixture: ComponentFixture<AuditTrailByAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

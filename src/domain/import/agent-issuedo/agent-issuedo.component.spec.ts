import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentIssuedoComponent } from './agent-issuedo.component';

describe('AgentIssuedoComponent', () => {
  let component: AgentIssuedoComponent;
  let fixture: ComponentFixture<AgentIssuedoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentIssuedoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentIssuedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

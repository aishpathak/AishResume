import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcarAgentGroupComponent } from './rcar-agent-group.component';

describe('RcarAgentGroupComponent', () => {
  let component: RcarAgentGroupComponent;
  let fixture: ComponentFixture<RcarAgentGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcarAgentGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcarAgentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

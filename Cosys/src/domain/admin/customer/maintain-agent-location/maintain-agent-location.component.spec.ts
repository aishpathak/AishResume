import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainAgentLocationComponent } from './maintain-agent-location.component';

describe('MaintainAgentLocationComponent', () => {
  let component: MaintainAgentLocationComponent;
  let fixture: ComponentFixture<MaintainAgentLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainAgentLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainAgentLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

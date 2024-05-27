import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTeamToAirportGroupComponent } from './assign-team-to-airport-group.component';

describe('AssignTeamToAirportGroupComponent', () => {
  let component: AssignTeamToAirportGroupComponent;
  let fixture: ComponentFixture<AssignTeamToAirportGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignTeamToAirportGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTeamToAirportGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

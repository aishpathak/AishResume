import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOutgoingFlightsComponent } from './display-outgoing-flights.component';

describe('DisplayOutgoingFlightsComponent', () => {
  let component: DisplayOutgoingFlightsComponent;
  let fixture: ComponentFixture<DisplayOutgoingFlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayOutgoingFlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayOutgoingFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

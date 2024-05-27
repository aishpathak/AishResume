import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingFlightsComponent } from './outgoing-flights.component';

describe('OutgoingFlightsComponent', () => {
  let component: OutgoingFlightsComponent;
  let fixture: ComponentFixture<OutgoingFlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingFlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

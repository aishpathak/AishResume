import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightpouchComponent } from './flightpouch.component';

describe('FlightpouchComponent', () => {
  let component: FlightpouchComponent;
  let fixture: ComponentFixture<FlightpouchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightpouchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightpouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

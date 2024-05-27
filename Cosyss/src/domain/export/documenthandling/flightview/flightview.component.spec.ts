import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightviewComponent } from './flightview.component';

describe('FlightviewComponent', () => {
  let component: FlightviewComponent;
  let fixture: ComponentFixture<FlightviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

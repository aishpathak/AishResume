import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCompleteComponent } from './flight-complete.component';

describe('FlightCompleteComponent', () => {
  let component: FlightCompleteComponent;
  let fixture: ComponentFixture<FlightCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

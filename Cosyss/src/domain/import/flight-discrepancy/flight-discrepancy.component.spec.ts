import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDiscrepancyComponent } from './flight-discrepancy.component';

describe('FlightDiscrepancyComponent', () => {
  let component: FlightDiscrepancyComponent;
  let fixture: ComponentFixture<FlightDiscrepancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightDiscrepancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightDiscrepancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

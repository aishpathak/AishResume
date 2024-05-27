import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCargoFlightDashboardComponent } from './special-cargo-flight-dashboard.component';

describe('SpecialCargoFlightDashboardComponent', () => {
  let component: SpecialCargoFlightDashboardComponent;
  let fixture: ComponentFixture<SpecialCargoFlightDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialCargoFlightDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCargoFlightDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFlightDashboardComponent } from './export-flight-dashboard.component';

describe('ExportFlightDashboardComponent', () => {
  let component: ExportFlightDashboardComponent;
  let fixture: ComponentFixture<ExportFlightDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFlightDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFlightDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

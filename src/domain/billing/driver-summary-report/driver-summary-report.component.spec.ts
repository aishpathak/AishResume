import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSummaryReportComponent } from './driver-summary-report.component';

describe('DriverSummaryReportComponent', () => {
  let component: DriverSummaryReportComponent;
  let fixture: ComponentFixture<DriverSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

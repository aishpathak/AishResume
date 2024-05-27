/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ExportFlightEVMDashboardTVComponent } from './export-FlightEVM-DashboardTV.component';

describe('ExportFlightEVMDashboardTVComponent', () => {
  let component: ExportFlightEVMDashboardTVComponent;
  let fixture: ComponentFixture<ExportFlightEVMDashboardTVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportFlightEVMDashboardTVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFlightEVMDashboardTVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ImportFlightEVMDashboardTVComponent } from './import-FlightEVM-DashboardTV.component';



describe('ImportFlightEVMDashboardTVComponent', () => {
  let component: ImportFlightEVMDashboardTVComponent;
  let fixture: ComponentFixture<ImportFlightEVMDashboardTVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportFlightEVMDashboardTVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFlightEVMDashboardTVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


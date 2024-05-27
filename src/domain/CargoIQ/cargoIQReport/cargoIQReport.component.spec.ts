/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CargoIQReportComponent } from './cargoIQReport.component';

describe('CargoIQReportComponent', () => {
  let component: CargoIQReportComponent;
  let fixture: ComponentFixture<CargoIQReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoIQReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoIQReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

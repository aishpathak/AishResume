/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoolportShipmentMonitoringComponent } from './coolport-shipment-monitoring.component';

describe('CoolportShipmentMonitoringComponent', () => {
  let component: CoolportShipmentMonitoringComponent;
  let fixture: ComponentFixture<CoolportShipmentMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoolportShipmentMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolportShipmentMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

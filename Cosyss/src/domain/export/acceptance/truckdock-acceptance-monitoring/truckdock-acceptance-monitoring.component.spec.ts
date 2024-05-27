/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TruckdockAcceptanceMonitoringComponent } from './truckdock-acceptance-monitoring.component';

describe('TruckdockAcceptanceMonitoringComponent', () => {
  let component: TruckdockAcceptanceMonitoringComponent;
  let fixture: ComponentFixture<TruckdockAcceptanceMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckdockAcceptanceMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckdockAcceptanceMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

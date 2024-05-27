/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShipmentfsusetupComponent } from './shipmentfsusetup.component';

describe('MonitoringmessagesComponent', () => {
  let component: ShipmentfsusetupComponent;
  let fixture: ComponentFixture<ShipmentfsusetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShipmentfsusetupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentfsusetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

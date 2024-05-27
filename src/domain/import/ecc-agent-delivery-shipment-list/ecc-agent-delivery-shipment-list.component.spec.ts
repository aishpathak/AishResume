/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EccAgentDeliveryShipmentListComponent } from './ecc-agent-delivery-shipment-list.component';

describe('EccAgentDeliveryShipmentListComponent', () => {
  let component: EccAgentDeliveryShipmentListComponent;
  let fixture: ComponentFixture<EccAgentDeliveryShipmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EccAgentDeliveryShipmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EccAgentDeliveryShipmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

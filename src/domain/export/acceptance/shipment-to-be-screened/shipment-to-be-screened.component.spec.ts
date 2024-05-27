/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShipmentToBeScreenedComponent } from './shipment-to-be-screened.component';

describe('ShipmentToBeScreenedComponent', () => {
  let component: ShipmentToBeScreenedComponent;
  let fixture: ComponentFixture<ShipmentToBeScreenedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentToBeScreenedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentToBeScreenedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

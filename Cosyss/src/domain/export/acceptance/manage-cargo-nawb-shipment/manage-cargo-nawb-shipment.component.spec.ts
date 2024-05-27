/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManageCargoNawbShipmentComponent } from './manage-cargo-nawb-shipment.component';

describe('ManageCargoNawbShipmentComponent', () => {
  let component: ManageCargoNawbShipmentComponent;
  let fixture: ComponentFixture<ManageCargoNawbShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCargoNawbShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCargoNawbShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

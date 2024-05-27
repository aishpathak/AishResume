/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManageCargoTruckingFlightComponent } from './manage-cargo-trucking-flight.component';

describe('ManageCargoTruckingFlightComponent', () => {
  let component: ManageCargoTruckingFlightComponent;
  let fixture: ComponentFixture<ManageCargoTruckingFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCargoTruckingFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCargoTruckingFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

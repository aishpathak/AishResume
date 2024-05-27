/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManageCargoTruckingSurfComponent } from './manage-cargo-trucking-surf.component';

describe('ManageCargoTruckingSurfComponent', () => {
  let component: ManageCargoTruckingSurfComponent;
  let fixture: ComponentFixture<ManageCargoTruckingSurfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCargoTruckingSurfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCargoTruckingSurfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

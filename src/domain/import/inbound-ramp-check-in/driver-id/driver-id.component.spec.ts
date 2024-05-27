/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DriverIdComponent } from './driver-id.component';

describe('DriverIdComponent', () => {
  let component: DriverIdComponent;
  let fixture: ComponentFixture<DriverIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

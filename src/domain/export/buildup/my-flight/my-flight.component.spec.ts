/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyFlightComponent } from './my-flight.component';

describe('MyFlightComponent', () => {
  let component: MyFlightComponent;
  let fixture: ComponentFixture<MyFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

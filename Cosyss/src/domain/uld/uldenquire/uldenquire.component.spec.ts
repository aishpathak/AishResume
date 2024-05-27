/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UldenquireComponent } from './uldenquire.component';

describe('UldenquireComponent', () => {
  let component: UldenquireComponent;
  let fixture: ComponentFixture<UldenquireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldenquireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldenquireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

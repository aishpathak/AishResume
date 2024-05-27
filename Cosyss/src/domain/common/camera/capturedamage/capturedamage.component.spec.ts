/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CapturedamageComponent } from './capturedamage.component';

describe('CapturedamageComponent', () => {
  let component: CapturedamageComponent;
  let fixture: ComponentFixture<CapturedamageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapturedamageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturedamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PayChargesComponent } from './payCharges.component';

describe('PayChargesComponent', () => {
  let component: PayChargesComponent;
  let fixture: ComponentFixture<PayChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

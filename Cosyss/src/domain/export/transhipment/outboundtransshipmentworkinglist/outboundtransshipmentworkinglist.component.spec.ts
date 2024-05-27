/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OutboundtransshipmentworkinglistComponent } from './outboundtransshipmentworkinglist.component';

describe('OutboundtransshipmentworkinglistComponent', () => {
  let component: OutboundtransshipmentworkinglistComponent;
  let fixture: ComponentFixture<OutboundtransshipmentworkinglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundtransshipmentworkinglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundtransshipmentworkinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

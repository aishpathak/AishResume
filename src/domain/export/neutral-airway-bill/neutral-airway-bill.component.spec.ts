/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NeutralAirwayBillComponent } from './neutral-airway-bill.component';

describe('NeutralAirwayBillComponent', () => {
  let component: NeutralAirwayBillComponent;
  let fixture: ComponentFixture<NeutralAirwayBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeutralAirwayBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeutralAirwayBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

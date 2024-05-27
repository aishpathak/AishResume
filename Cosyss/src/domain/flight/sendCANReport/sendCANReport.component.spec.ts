/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendCANReportComponent } from './sendCANReport.component';

describe('SendCANReportComponent', () => {
  let component: SendCANReportComponent;
  let fixture: ComponentFixture<SendCANReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCANReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCANReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

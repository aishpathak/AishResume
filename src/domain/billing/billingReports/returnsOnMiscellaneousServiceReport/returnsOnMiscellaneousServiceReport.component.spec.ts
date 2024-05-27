/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReturnsOnMiscellaneousServiceReportComponent } from './returnsOnMiscellaneousServiceReport.component';

describe('ReturnsOnMiscellaneousServiceReportComponent', () => {
  let component: ReturnsOnMiscellaneousServiceReportComponent;
  let fixture: ComponentFixture<ReturnsOnMiscellaneousServiceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnsOnMiscellaneousServiceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnsOnMiscellaneousServiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

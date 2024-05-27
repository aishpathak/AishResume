/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BankingSlipsReportComponent } from './bankingSlipsReport.component';

describe('BankingSlipsReportComponent', () => {
  let component: BankingSlipsReportComponent;
  let fixture: ComponentFixture<BankingSlipsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankingSlipsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankingSlipsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

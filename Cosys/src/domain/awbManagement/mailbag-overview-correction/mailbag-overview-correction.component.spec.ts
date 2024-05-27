/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MailbagOverviewCorrectionComponent } from './mailbag-overview-correction.component';

describe('MailbagOverviewCorrectionComponent', () => {
  let component: MailbagOverviewCorrectionComponent;
  let fixture: ComponentFixture<MailbagOverviewCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailbagOverviewCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailbagOverviewCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

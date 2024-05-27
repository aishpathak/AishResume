/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MailOuthouseAcceptanceComponent } from './mail-outhouse-acceptance.component';

describe('MailOuthouseAcceptanceComponent', () => {
  let component: MailOuthouseAcceptanceComponent;
  let fixture: ComponentFixture<MailOuthouseAcceptanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailOuthouseAcceptanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailOuthouseAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

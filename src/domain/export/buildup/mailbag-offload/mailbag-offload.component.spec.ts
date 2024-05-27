/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MailbagOffloadComponent } from './mailbag-offload.component';

describe('MailbagOffloadComponent', () => {
  let component: MailbagOffloadComponent;
  let fixture: ComponentFixture<MailbagOffloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailbagOffloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailbagOffloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

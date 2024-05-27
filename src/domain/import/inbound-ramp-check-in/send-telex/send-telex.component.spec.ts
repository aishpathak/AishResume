/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendTelexComponent } from './send-telex.component';

describe('SendTelexComponent', () => {
  let component: SendTelexComponent;
  let fixture: ComponentFixture<SendTelexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendTelexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTelexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

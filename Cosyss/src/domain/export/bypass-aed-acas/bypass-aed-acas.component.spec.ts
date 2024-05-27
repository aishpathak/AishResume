/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BypassAedAcasComponent } from './bypass-aed-acas.component';

describe('BypassAedAcasComponent', () => {
  let component: BypassAedAcasComponent;
  let fixture: ComponentFixture<BypassAedAcasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BypassAedAcasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BypassAedAcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SignedhandoverformComponent } from './signedhandoverform.component';

describe('SignedhandoverformComponent', () => {
  let component: SignedhandoverformComponent;
  let fixture: ComponentFixture<SignedhandoverformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignedhandoverformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedhandoverformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

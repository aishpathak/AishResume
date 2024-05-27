/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RadioactiveComponent } from './radioactive.component';

describe('RadioactiveComponent', () => {
  let component: RadioactiveComponent;
  let fixture: ComponentFixture<RadioactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

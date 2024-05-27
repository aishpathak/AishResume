/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustomACESMRSComponent } from './custom-ACES-MRS.component';

describe('CustomACESMRSComponent', () => {
  let component: CustomACESMRSComponent;
  let fixture: ComponentFixture<CustomACESMRSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomACESMRSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomACESMRSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

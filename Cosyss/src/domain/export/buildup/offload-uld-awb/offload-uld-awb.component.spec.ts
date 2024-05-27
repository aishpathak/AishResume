/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OffloadUldAwbComponent } from './offload-uld-awb.component';

describe('OffloadUldAwbComponent', () => {
  let component: OffloadUldAwbComponent;
  let fixture: ComponentFixture<OffloadUldAwbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffloadUldAwbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffloadUldAwbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

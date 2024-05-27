/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddingnewrowComponent } from './addingnewrow.component';

describe('AddingnewrowComponent', () => {
  let component: AddingnewrowComponent;
  let fixture: ComponentFixture<AddingnewrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddingnewrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingnewrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

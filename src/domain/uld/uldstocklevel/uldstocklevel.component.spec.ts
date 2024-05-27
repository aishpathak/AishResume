/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UldstocklevelComponent } from './uldstocklevel.component';

describe('UldstocklevelComponent', () => {
  let component: UldstocklevelComponent;
  let fixture: ComponentFixture<UldstocklevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldstocklevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldstocklevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

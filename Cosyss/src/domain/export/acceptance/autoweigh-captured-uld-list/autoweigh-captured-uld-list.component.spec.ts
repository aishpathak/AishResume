/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AutoweighCapturedUldListComponent } from './autoweigh-captured-uld-list.component';

describe('AutoweighCapturedUldListComponent', () => {
  let component: AutoweighCapturedUldListComponent;
  let fixture: ComponentFixture<AutoweighCapturedUldListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoweighCapturedUldListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoweighCapturedUldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

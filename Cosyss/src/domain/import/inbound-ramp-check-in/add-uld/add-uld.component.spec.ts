/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddUldComponent } from './add-uld.component';

describe('AddUldComponent', () => {
  let component: AddUldComponent;
  let fixture: ComponentFixture<AddUldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

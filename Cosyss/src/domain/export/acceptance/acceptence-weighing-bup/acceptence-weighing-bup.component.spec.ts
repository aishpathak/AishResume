/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AcceptenceWeighingBupComponent } from './acceptence-weighing-bup.component';

describe('AcceptenceWeighingBupComponent', () => {
  let component: AcceptenceWeighingBupComponent;
  let fixture: ComponentFixture<AcceptenceWeighingBupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptenceWeighingBupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptenceWeighingBupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

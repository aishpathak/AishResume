/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OffloadHandoverComponent } from './offload-handover.component';

describe('OffloadHandoverComponent', () => {
  let component: OffloadHandoverComponent;
  let fixture: ComponentFixture<OffloadHandoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffloadHandoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffloadHandoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

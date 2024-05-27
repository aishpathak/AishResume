/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SetupCargoProcessPrecedentsComponent } from './setup-cargo-process-precedents.component';

describe('SetupCargoProcessPrecedentsComponent', () => {
  let component: SetupCargoProcessPrecedentsComponent;
  let fixture: ComponentFixture<SetupCargoProcessPrecedentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupCargoProcessPrecedentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupCargoProcessPrecedentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

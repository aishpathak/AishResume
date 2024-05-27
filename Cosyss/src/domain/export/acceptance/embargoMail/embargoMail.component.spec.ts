/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmbargoMailComponent } from './embargoMail.component';

describe('EmbargoMailComponent', () => {
  let component: EmbargoMailComponent;
  let fixture: ComponentFixture<EmbargoMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbargoMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbargoMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

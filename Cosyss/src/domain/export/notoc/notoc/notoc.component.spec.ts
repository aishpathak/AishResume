/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotocComponent } from './notoc.component';

describe('NotocComponent', () => {
  let component: NotocComponent;
  let fixture: ComponentFixture<NotocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

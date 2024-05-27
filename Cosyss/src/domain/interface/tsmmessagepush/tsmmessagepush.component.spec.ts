/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TsmmessagepushComponent } from './tsmmessagepush.component';

describe('TsmmessagepushComponent', () => {
  let component: TsmmessagepushComponent;
  let fixture: ComponentFixture<TsmmessagepushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TsmmessagepushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TsmmessagepushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

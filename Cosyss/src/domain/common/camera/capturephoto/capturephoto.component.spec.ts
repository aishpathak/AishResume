/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CapturephotoComponent } from './capturephoto.component';

describe('CapturephotoComponent', () => {
  let component: CapturephotoComponent;
  let fixture: ComponentFixture<CapturephotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapturephotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturephotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

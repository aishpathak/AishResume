/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditsetupmessagedefinitionComponent } from './editsetupmessagedefinition.component';

describe('EditsetupmessagedefinitionComponent', () => {
  let component: EditsetupmessagedefinitionComponent;
  let fixture: ComponentFixture<EditsetupmessagedefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditsetupmessagedefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsetupmessagedefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

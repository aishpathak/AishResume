/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManageCargoTranshipmentCourierComponent } from './manage-cargo-transhipment-courier.component';

describe('ManageCargoTranshipmentCourierComponent', () => {
  let component: ManageCargoTranshipmentCourierComponent;
  let fixture: ComponentFixture<ManageCargoTranshipmentCourierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCargoTranshipmentCourierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCargoTranshipmentCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

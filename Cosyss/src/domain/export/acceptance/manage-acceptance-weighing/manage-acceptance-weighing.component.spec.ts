/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManageAcceptanceWeighingComponent } from './manage-acceptance-weighing.component';

describe('ManageAcceptanceWeighingComponent', () => {
  let component: ManageAcceptanceWeighingComponent;
  let fixture: ComponentFixture<ManageAcceptanceWeighingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAcceptanceWeighingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAcceptanceWeighingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

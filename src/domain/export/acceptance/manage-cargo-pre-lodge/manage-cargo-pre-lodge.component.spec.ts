/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManageCargoPreLodgeComponent } from './manage-cargo-pre-lodge.component';

describe('ManageCargoPreLodgeComponent', () => {
  let component: ManageCargoPreLodgeComponent;
  let fixture: ComponentFixture<ManageCargoPreLodgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCargoPreLodgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCargoPreLodgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

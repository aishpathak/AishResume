/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InventorychecklistComponent } from './inventorychecklist.component';

describe('InventorychecklistComponent', () => {
  let component: InventorychecklistComponent;
  let fixture: ComponentFixture<InventorychecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorychecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorychecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

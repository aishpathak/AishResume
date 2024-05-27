/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransshipmenthandlingandmonitoringComponent } from './transshipmenthandlingandmonitoring.component';

describe('TransshipmenthandlingandmonitoringComponent', () => {
  let component: TransshipmenthandlingandmonitoringComponent;
  let fixture: ComponentFixture<TransshipmenthandlingandmonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransshipmenthandlingandmonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransshipmenthandlingandmonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

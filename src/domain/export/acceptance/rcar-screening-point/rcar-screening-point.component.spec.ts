/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RcarScreeningPointComponent } from './rcar-screening-point.component';

describe('RcarScreeningPointComponent', () => {
  let component: RcarScreeningPointComponent;
  let fixture: ComponentFixture<RcarScreeningPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcarScreeningPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcarScreeningPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

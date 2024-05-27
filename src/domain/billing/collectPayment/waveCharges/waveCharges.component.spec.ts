/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WaveChargesComponent } from './waveCharges.component';

describe('WaveChargesComponent', () => {
  let component: WaveChargesComponent;
  let fixture: ComponentFixture<WaveChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

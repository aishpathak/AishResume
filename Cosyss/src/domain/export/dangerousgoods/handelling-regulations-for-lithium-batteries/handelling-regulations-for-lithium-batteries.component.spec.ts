/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HandellingRegulationsForLithiumBatteriesComponent } from './handelling-regulations-for-lithium-batteries.component';

describe('HandellingRegulationsForLithiumBatteriesComponent', () => {
  let component: HandellingRegulationsForLithiumBatteriesComponent;
  let fixture: ComponentFixture<HandellingRegulationsForLithiumBatteriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandellingRegulationsForLithiumBatteriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandellingRegulationsForLithiumBatteriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

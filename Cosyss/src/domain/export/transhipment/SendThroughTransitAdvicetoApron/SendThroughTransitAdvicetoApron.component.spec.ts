/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendThroughTransitAdvicetoApronComponent } from './SendThroughTransitAdvicetoApron.component';

describe('SendThroughTransitAdvicetoApronComponent', () => {
  let component: SendThroughTransitAdvicetoApronComponent;
  let fixture: ComponentFixture<SendThroughTransitAdvicetoApronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendThroughTransitAdvicetoApronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendThroughTransitAdvicetoApronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

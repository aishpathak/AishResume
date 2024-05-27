/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BroadcastnotificationmessageComponent } from './broadcastnotificationmessage.component';

describe('BroadcastnotificationmessageComponent', () => {
  let component: BroadcastnotificationmessageComponent;
  let fixture: ComponentFixture<BroadcastnotificationmessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastnotificationmessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastnotificationmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

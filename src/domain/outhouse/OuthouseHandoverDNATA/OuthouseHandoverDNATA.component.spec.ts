/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OuthouseHandoverDNATAComponent } from './OuthouseHandoverDNATA.component';

describe('OuthouseHandoverDNATAComponent', () => {
  let component: OuthouseHandoverDNATAComponent;
  let fixture: ComponentFixture<OuthouseHandoverDNATAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OuthouseHandoverDNATAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuthouseHandoverDNATAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

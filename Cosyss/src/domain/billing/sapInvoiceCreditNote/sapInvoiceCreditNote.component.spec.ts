/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SapInvoiceCreditNoteComponent } from './sapInvoiceCreditNote.component';

describe('SapInvoiceCreditNoteComponent', () => {
  let component: SapInvoiceCreditNoteComponent;
  let fixture: ComponentFixture<SapInvoiceCreditNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SapInvoiceCreditNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SapInvoiceCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDebitNoteComponent } from './credit-debit-note.component';

describe('CreditDebitNoteComponent', () => {
  let component: CreditDebitNoteComponent;
  let fixture: ComponentFixture<CreditDebitNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditDebitNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdAccountLedgerComponent } from './pd-account-ledger.component';

describe('PdAccountLedgerComponent', () => {
  let component: PdAccountLedgerComponent;
  let fixture: ComponentFixture<PdAccountLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdAccountLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdAccountLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

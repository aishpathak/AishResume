import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfInvoicesComponent } from './list-of-invoices.component';

describe('ListOfInvoicesComponent', () => {
  let component: ListOfInvoicesComponent;
  let fixture: ComponentFixture<ListOfInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

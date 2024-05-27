import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingverificationComponent } from './billingverification.component';

describe('BillingverificationComponent', () => {
  let component: BillingverificationComponent;
  let fixture: ComponentFixture<BillingverificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingverificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

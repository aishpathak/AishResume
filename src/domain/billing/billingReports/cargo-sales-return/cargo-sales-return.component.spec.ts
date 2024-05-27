import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoSalesReturnComponent } from './cargo-sales-return.component';

describe('CargoSalesReturnComponent', () => {
  let component: CargoSalesReturnComponent;
  let fixture: ComponentFixture<CargoSalesReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoSalesReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoSalesReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

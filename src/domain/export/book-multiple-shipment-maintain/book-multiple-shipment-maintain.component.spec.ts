import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMultipleShipmentMaintainComponent } from './book-multiple-shipment-maintain.component';

describe('BookMultipleShipmentMaintainComponent', () => {
  let component: BookMultipleShipmentMaintainComponent;
  let fixture: ComponentFixture<BookMultipleShipmentMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookMultipleShipmentMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookMultipleShipmentMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

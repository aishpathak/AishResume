import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMultipleShipmentComponent } from './book-multiple-shipment.component';

describe('BookMultipleShipmentComponent', () => {
  let component: BookMultipleShipmentComponent;
  let fixture: ComponentFixture<BookMultipleShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookMultipleShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookMultipleShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

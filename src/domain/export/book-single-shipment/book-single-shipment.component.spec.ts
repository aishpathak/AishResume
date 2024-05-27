import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSingleShipmentComponent } from './book-single-shipment.component';

describe('BookSingleShipmentComponent', () => {
  let component: BookSingleShipmentComponent;
  let fixture: ComponentFixture<BookSingleShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookSingleShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSingleShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

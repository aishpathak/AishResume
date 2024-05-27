import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBookedShipmentComponent } from './cancel-booked-shipment.component';

describe('CancelBookedShipmentComponent', () => {
  let component: CancelBookedShipmentComponent;
  let fixture: ComponentFixture<CancelBookedShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelBookedShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelBookedShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

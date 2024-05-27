import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinShipmentComponent } from './checkin-shipment.component';

describe('CheckinShipmentComponent', () => {
  let component: CheckinShipmentComponent;
  let fixture: ComponentFixture<CheckinShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

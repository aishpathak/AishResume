import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentListByLocationComponent } from './shipment-list-by-location.component';

describe('ShipmentListByLocationComponent', () => {
  let component: ShipmentListByLocationComponent;
  let fixture: ComponentFixture<ShipmentListByLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentListByLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentListByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

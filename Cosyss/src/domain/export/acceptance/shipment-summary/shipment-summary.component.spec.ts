import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentSummaryComponent } from './shipment-summary.component';

describe('ShipmentSummaryComponent', () => {
  let component: ShipmentSummaryComponent;
  let fixture: ComponentFixture<ShipmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

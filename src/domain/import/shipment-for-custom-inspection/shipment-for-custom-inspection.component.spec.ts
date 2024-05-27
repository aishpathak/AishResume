import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentForCustomInspectionComponent } from './shipment-for-custom-inspection.component';

describe('ShipmentForCustomInspectionComponent', () => {
  let component: ShipmentForCustomInspectionComponent;
  let fixture: ComponentFixture<ShipmentForCustomInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentForCustomInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentForCustomInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

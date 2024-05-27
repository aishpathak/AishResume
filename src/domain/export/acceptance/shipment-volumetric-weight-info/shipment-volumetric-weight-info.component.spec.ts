import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentVolumetricWeightInfoComponent } from './shipment-volumetric-weight-info.component';

describe('ShipmentVolumetricWeightInfoComponent', () => {
  let component: ShipmentVolumetricWeightInfoComponent;
  let fixture: ComponentFixture<ShipmentVolumetricWeightInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentVolumetricWeightInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentVolumetricWeightInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentEmbargoComponent } from './shipment-embargo.component';

describe('ShipmentEmbargoComponent', () => {
  let component: ShipmentEmbargoComponent;
  let fixture: ComponentFixture<ShipmentEmbargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentEmbargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentEmbargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

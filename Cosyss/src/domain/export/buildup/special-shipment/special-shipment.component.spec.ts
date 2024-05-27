import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialShipmentComponent } from './special-shipment.component';

describe('SpecialShipmentComponent', () => {
  let component: SpecialShipmentComponent;
  let fixture: ComponentFixture<SpecialShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

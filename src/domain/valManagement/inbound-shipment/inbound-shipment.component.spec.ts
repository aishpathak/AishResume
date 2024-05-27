import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundShipmentComponent } from './inbound-shipment.component';

describe('InboundShipmentComponent', () => {
  let component: InboundShipmentComponent;
  let fixture: ComponentFixture<InboundShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

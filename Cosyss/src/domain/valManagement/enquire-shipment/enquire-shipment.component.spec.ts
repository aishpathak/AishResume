import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquireShipmentComponent } from './enquire-shipment.component';

describe('EnquireShipmentComponent', () => {
  let component: EnquireShipmentComponent;
  let fixture: ComponentFixture<EnquireShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquireShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquireShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

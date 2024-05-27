import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitInitialShipmentComponent } from './submit-initial-shipment.component';

describe('SubmitInitialShipmentComponent', () => {
  let component: SubmitInitialShipmentComponent;
  let fixture: ComponentFixture<SubmitInitialShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitInitialShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitInitialShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAmendedShipmentComponent } from './submit-amended-shipment.component';

describe('SubmitAmendedShipmentComponent', () => {
  let component: SubmitAmendedShipmentComponent;
  let fixture: ComponentFixture<SubmitAmendedShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitAmendedShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitAmendedShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

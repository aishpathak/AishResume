import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitLeftBehindShipmentComponent } from './submit-left-behind-shipment.component';

describe('SubmitLeftBehindShipmentComponent', () => {
  let component: SubmitLeftBehindShipmentComponent;
  let fixture: ComponentFixture<SubmitLeftBehindShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitLeftBehindShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitLeftBehindShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

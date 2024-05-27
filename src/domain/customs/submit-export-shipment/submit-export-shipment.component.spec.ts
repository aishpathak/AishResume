import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitExportShipmentComponent } from './submit-export-shipment.component';

describe('SubmitExportShipmentComponent', () => {
  let component: SubmitExportShipmentComponent;
  let fixture: ComponentFixture<SubmitExportShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitExportShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitExportShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

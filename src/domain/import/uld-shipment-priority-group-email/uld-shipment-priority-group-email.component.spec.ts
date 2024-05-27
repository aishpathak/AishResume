import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldShipmentPriorityGroupEmailComponent } from './uld-shipment-priority-group-email.component';

describe('UldShipmentPriorityGroupEmailComponent', () => {
  let component: UldShipmentPriorityGroupEmailComponent;
  let fixture: ComponentFixture<UldShipmentPriorityGroupEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldShipmentPriorityGroupEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldShipmentPriorityGroupEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

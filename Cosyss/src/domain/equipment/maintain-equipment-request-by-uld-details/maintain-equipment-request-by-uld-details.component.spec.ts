import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainEquipmentRequestByUldDetailsComponent } from './maintain-equipment-request-by-uld-details.component';

describe('MaintainEquipmentRequestByUldDetailsComponent', () => {
  let component: MaintainEquipmentRequestByUldDetailsComponent;
  let fixture: ComponentFixture<MaintainEquipmentRequestByUldDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainEquipmentRequestByUldDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainEquipmentRequestByUldDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

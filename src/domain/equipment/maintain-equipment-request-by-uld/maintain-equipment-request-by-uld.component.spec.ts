import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainEquipmentRequestByULDComponent } from './maintain-equipment-request-by-uld.component';

describe('MaintainEquipmentRequestByULDComponent', () => {
  let component: MaintainEquipmentRequestByULDComponent;
  let fixture: ComponentFixture<MaintainEquipmentRequestByULDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainEquipmentRequestByULDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainEquipmentRequestByULDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

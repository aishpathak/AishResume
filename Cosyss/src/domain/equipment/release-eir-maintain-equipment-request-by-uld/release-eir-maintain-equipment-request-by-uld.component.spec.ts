import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseEirMaintainEquipmentRequestByUldComponent } from './release-eir-maintain-equipment-request-by-uld.component';

describe('ReleaseEirMaintainEquipmentRequestByUldComponent', () => {
  let component: ReleaseEirMaintainEquipmentRequestByUldComponent;
  let fixture: ComponentFixture<ReleaseEirMaintainEquipmentRequestByUldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseEirMaintainEquipmentRequestByUldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseEirMaintainEquipmentRequestByUldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

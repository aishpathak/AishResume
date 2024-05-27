import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentRequestByULDComponent } from './equipment-request-by-uld.component';

describe('EquipmentRequestByULDComponent', () => {
  let component: EquipmentRequestByULDComponent;
  let fixture: ComponentFixture<EquipmentRequestByULDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentRequestByULDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentRequestByULDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

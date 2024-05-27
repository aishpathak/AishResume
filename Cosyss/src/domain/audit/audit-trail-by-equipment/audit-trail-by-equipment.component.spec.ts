import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailByEquipmentComponent } from './audit-trail-by-equipment.component';

describe('AuditTrailByEquipmentComponent', () => {
  let component: AuditTrailByEquipmentComponent;
  let fixture: ComponentFixture<AuditTrailByEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailByEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailByEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

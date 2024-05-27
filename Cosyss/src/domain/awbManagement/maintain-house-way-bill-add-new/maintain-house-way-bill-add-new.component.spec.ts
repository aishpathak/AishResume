import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainHouseWayBillAddNewComponent } from './maintain-house-way-bill-add-new.component';

describe('MaintainHouseWayBillAddNewComponent', () => {
  let component: MaintainHouseWayBillAddNewComponent;
  let fixture: ComponentFixture<MaintainHouseWayBillAddNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainHouseWayBillAddNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainHouseWayBillAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainHouseWayBillEditComponent } from './maintain-house-way-bill-edit.component';

describe('MaintainHouseWayBillEditComponent', () => {
  let component: MaintainHouseWayBillEditComponent;
  let fixture: ComponentFixture<MaintainHouseWayBillEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainHouseWayBillEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainHouseWayBillEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

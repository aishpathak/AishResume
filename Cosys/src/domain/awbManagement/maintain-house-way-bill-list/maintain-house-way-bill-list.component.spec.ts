import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainHouseWayBillListComponent } from './maintain-house-way-bill-list.component';

describe('MaintainHouseWayBillListComponent', () => {
  let component: MaintainHouseWayBillListComponent;
  let fixture: ComponentFixture<MaintainHouseWayBillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainHouseWayBillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainHouseWayBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHouseWayBillComponent } from './delete-house-way-bill.component';

describe('DeleteHouseWayBillComponent', () => {
  let component: DeleteHouseWayBillComponent;
  let fixture: ComponentFixture<DeleteHouseWayBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteHouseWayBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteHouseWayBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

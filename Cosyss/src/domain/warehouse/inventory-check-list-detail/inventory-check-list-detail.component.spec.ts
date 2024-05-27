import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCheckListDetailComponent } from './inventory-check-list-detail.component';

describe('InventoryCheckListDetailComponent', () => {
  let component: InventoryCheckListDetailComponent;
  let fixture: ComponentFixture<InventoryCheckListDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCheckListDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCheckListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

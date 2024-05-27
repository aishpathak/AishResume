import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCheckListComponent } from './inventory-check-list.component';

describe('InventoryCheckListComponent', () => {
  let component: InventoryCheckListComponent;
  let fixture: ComponentFixture<InventoryCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

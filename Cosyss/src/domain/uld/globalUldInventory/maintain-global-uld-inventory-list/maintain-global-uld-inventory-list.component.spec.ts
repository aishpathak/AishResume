import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainGlobalUldInventoryListComponent } from './maintain-global-uld-inventory-list.component';

describe('MaintainGlobalUldInventoryListComponent', () => {
  let component: MaintainGlobalUldInventoryListComponent;
  let fixture: ComponentFixture<MaintainGlobalUldInventoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainGlobalUldInventoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainGlobalUldInventoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

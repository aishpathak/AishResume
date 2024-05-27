import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldInventoryDetailsComponent } from './uld-inventory-details.component';

describe('UldInventoryDetailsComponent', () => {
  let component: UldInventoryDetailsComponent;
  let fixture: ComponentFixture<UldInventoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldInventoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldInventoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

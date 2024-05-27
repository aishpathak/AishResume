import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbStockManagementComponent } from './awb-stock-management.component';

describe('AwbStockManagementComponent', () => {
  let component: AwbStockManagementComponent;
  let fixture: ComponentFixture<AwbStockManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwbStockManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbStockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

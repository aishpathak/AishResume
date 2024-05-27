import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbStockStatusComponent } from './awb-stock-status.component';

describe('AwbStockStatusComponent', () => {
  let component: AwbStockStatusComponent;
  let fixture: ComponentFixture<AwbStockStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwbStockStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbStockStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

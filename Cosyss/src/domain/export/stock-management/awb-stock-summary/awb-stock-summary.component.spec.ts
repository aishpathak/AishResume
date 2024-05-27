import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbStockSummaryComponent } from './awb-stock-summary.component';

describe('AwbStockSummaryComponent', () => {
  let component: AwbStockSummaryComponent;
  let fixture: ComponentFixture<AwbStockSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwbStockSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbStockSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

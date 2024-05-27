import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockconsolidationComponent } from './stockconsolidation.component';

describe('StockconsolidationComponent', () => {
  let component: StockconsolidationComponent;
  let fixture: ComponentFixture<StockconsolidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockconsolidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockconsolidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

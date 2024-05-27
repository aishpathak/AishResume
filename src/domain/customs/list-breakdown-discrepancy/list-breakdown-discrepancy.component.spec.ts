import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBreakdownDiscrepancyComponent } from './list-breakdown-discrepancy.component';

describe('ListBreakdownDiscrepancyComponent', () => {
  let component: ListBreakdownDiscrepancyComponent;
  let fixture: ComponentFixture<ListBreakdownDiscrepancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBreakdownDiscrepancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBreakdownDiscrepancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

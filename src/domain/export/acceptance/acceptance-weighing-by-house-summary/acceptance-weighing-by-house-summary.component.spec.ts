import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceWeighingByHouseSummaryComponent } from './acceptance-weighing-by-house-summary.component';

describe('AcceptanceWeighingByHouseSummaryComponent', () => {
  let component: AcceptanceWeighingByHouseSummaryComponent;
  let fixture: ComponentFixture<AcceptanceWeighingByHouseSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptanceWeighingByHouseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceWeighingByHouseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

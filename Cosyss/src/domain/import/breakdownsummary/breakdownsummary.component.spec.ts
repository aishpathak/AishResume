import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownsummaryComponent } from './breakdownsummary.component';

describe('BreakdownsummaryComponent', () => {
  let component: BreakdownsummaryComponent;
  let fixture: ComponentFixture<BreakdownsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakdownsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakdownsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

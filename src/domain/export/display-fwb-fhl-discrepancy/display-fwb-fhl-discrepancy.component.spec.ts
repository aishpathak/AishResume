import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFwbFhlDiscrepancyComponent } from './display-fwb-fhl-discrepancy.component';

describe('DisplayFwbFhlDiscrepancyComponent', () => {
  let component: DisplayFwbFhlDiscrepancyComponent;
  let fixture: ComponentFixture<DisplayFwbFhlDiscrepancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayFwbFhlDiscrepancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayFwbFhlDiscrepancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

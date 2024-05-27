import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FwbFhlDiscrepancyComponent } from './fwb-fhl-discrepancy.component';

describe('FwbFhlDiscrepancyComponent', () => {
  let component: FwbFhlDiscrepancyComponent;
  let fixture: ComponentFixture<FwbFhlDiscrepancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FwbFhlDiscrepancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FwbFhlDiscrepancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

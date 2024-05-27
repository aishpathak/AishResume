import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceMonitoringByHouseComponent } from './acceptance-monitoring-by-house.component';

describe('AcceptanceMonitoringByHouseComponent', () => {
  let component: AcceptanceMonitoringByHouseComponent;
  let fixture: ComponentFixture<AcceptanceMonitoringByHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptanceMonitoringByHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceMonitoringByHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

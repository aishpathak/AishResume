import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDockMonitoringComponent } from './truck-dock-monitoring.component';

describe('TruckDockMonitoringComponent', () => {
  let component: TruckDockMonitoringComponent;
  let fixture: ComponentFixture<TruckDockMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckDockMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckDockMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

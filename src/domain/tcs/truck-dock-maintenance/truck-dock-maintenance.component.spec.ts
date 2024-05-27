import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDockMaintenanceComponent } from './truck-dock-maintenance.component';

describe('TruckDockMaintenanceComponent', () => {
  let component: TruckDockMaintenanceComponent;
  let fixture: ComponentFixture<TruckDockMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckDockMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckDockMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

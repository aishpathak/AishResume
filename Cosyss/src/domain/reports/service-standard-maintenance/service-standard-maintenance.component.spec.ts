import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStandardMaintenanceComponent } from './service-standard-maintenance.component';

describe('ServiceStandardMaintenanceComponent', () => {
  let component: ServiceStandardMaintenanceComponent;
  let fixture: ComponentFixture<ServiceStandardMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceStandardMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStandardMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

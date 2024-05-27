import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceoperativeflightComponent } from './maintenanceoperativeflight.component';

describe('MaintenanceoperativeflightComponent', () => {
  let component: MaintenanceoperativeflightComponent;
  let fixture: ComponentFixture<MaintenanceoperativeflightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceoperativeflightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceoperativeflightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

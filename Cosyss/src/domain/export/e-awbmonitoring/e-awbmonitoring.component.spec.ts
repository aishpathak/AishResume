import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EAWBMonitoringComponent } from './e-awbmonitoring.component';

describe('EAWBMonitoringComponent', () => {
  let component: EAWBMonitoringComponent;
  let fixture: ComponentFixture<EAWBMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EAWBMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EAWBMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

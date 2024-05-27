import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EorderMonitoringComponent } from './eorder-monitoring.component';

describe('EorderMonitoringComponent', () => {
  let component: EorderMonitoringComponent;
  let fixture: ComponentFixture<EorderMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EorderMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EorderMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCargoMonitoringListComponent } from './special-cargo-monitoring-list.component';

describe('SpecialCargoMonitoringListComponent', () => {
  let component: SpecialCargoMonitoringListComponent;
  let fixture: ComponentFixture<SpecialCargoMonitoringListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialCargoMonitoringListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCargoMonitoringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

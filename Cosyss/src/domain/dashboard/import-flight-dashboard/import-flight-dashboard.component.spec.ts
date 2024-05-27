import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFlightDashboardComponent } from './import-flight-dashboard.component';

describe('ImportFlightDashboardComponent', () => {
  let component: ImportFlightDashboardComponent;
  let fixture: ComponentFixture<ImportFlightDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFlightDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFlightDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

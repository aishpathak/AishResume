import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardtvComponent } from './export-FlightEVM-SlaTV.component';

describe('DashboardtvComponent', () => {
  let component: DashboardtvComponent;
  let fixture: ComponentFixture<DashboardtvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardtvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardtvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


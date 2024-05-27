import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgcRegularReportComponent } from './ngc-regular-report.component';

describe('NgcRegularReportComponent', () => {
  let component: NgcRegularReportComponent;
  let fixture: ComponentFixture<NgcRegularReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgcRegularReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgcRegularReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

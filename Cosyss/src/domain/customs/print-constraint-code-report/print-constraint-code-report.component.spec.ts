import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConstraintCodeReportComponent } from './print-constraint-code-report.component';

describe('PrintConstraintCodeReportComponent', () => {
  let component: PrintConstraintCodeReportComponent;
  let fixture: ComponentFixture<PrintConstraintCodeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintConstraintCodeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintConstraintCodeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

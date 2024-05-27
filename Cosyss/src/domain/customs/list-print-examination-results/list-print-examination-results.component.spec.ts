import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrintExaminationResultsComponent } from './list-print-examination-results.component';

describe('ListPrintExaminationResultsComponent', () => {
  let component: ListPrintExaminationResultsComponent;
  let fixture: ComponentFixture<ListPrintExaminationResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPrintExaminationResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPrintExaminationResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

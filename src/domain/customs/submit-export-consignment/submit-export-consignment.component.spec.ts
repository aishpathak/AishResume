import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitExportConsignmentComponent } from './submit-export-consignment.component';

describe('SubmitExportConsignmentComponent', () => {
  let component: SubmitExportConsignmentComponent;
  let fixture: ComponentFixture<SubmitExportConsignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitExportConsignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitExportConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

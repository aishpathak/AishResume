import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAmendedConsignmentComponent } from './submit-amended-consignment.component';

describe('SubmitAmendedConsignmentComponent', () => {
  let component: SubmitAmendedConsignmentComponent;
  let fixture: ComponentFixture<SubmitAmendedConsignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitAmendedConsignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitAmendedConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

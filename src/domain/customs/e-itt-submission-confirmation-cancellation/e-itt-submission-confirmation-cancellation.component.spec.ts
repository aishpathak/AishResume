import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EIttSubmissionConfirmationCancellationComponent } from './e-itt-submission-confirmation-cancellation.component';

describe('EIttSubmissionConfirmationCancellationComponent', () => {
  let component: EIttSubmissionConfirmationCancellationComponent;
  let fixture: ComponentFixture<EIttSubmissionConfirmationCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EIttSubmissionConfirmationCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EIttSubmissionConfirmationCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

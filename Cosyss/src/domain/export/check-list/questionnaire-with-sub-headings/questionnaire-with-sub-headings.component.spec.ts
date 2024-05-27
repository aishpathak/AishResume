import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireWithSubHeadingsComponent } from './questionnaire-with-sub-headings.component';

describe('QuestionnaireWithSubHeadingsComponent', () => {
  let component: QuestionnaireWithSubHeadingsComponent;
  let fixture: ComponentFixture<QuestionnaireWithSubHeadingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireWithSubHeadingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireWithSubHeadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

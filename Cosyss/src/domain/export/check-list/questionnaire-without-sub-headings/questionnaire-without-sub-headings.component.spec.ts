import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireWithoutSubHeadingsComponent } from './questionnaire-without-sub-headings.component';

describe('QuestionnaireWithoutSubHeadingsComponent', () => {
  let component: QuestionnaireWithoutSubHeadingsComponent;
  let fixture: ComponentFixture<QuestionnaireWithoutSubHeadingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireWithoutSubHeadingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireWithoutSubHeadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

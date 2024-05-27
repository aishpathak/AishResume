import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySearchDetailsComponent } from './survey-search-details.component';

describe('SurveySearchDetailsComponent', () => {
  let component: SurveySearchDetailsComponent;
  let fixture: ComponentFixture<SurveySearchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveySearchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveySearchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

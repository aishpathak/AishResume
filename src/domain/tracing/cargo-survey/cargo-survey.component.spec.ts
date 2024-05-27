import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoSurveyComponent } from './cargo-survey.component';

describe('CargoSurveyComponent', () => {
  let component: CargoSurveyComponent;
  let fixture: ComponentFixture<CargoSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

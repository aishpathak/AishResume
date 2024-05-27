import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListTemplateEngineComponent } from './check-list-template-engine.component';

describe('CheckListTemplateEngineComponent', () => {
  let component: CheckListTemplateEngineComponent;
  let fixture: ComponentFixture<CheckListTemplateEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckListTemplateEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckListTemplateEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

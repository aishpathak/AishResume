import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayConstraintComponent } from './display-constraint.component';

describe('DisplayConstraintComponent', () => {
  let component: DisplayConstraintComponent;
  let fixture: ComponentFixture<DisplayConstraintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayConstraintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

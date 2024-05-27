import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateHandlingConstraintComponent } from './associate-handling-constraint.component';

describe('AssociateHandlingConstraintComponent', () => {
  let component: AssociateHandlingConstraintComponent;
  let fixture: ComponentFixture<AssociateHandlingConstraintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateHandlingConstraintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateHandlingConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

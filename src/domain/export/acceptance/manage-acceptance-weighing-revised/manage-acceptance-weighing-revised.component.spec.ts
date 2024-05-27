import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAcceptanceWeighingRevisedComponent } from './manage-acceptance-weighing-revised.component';

describe('ManageAcceptanceWeighingRevisedComponent', () => {
  let component: ManageAcceptanceWeighingRevisedComponent;
  let fixture: ComponentFixture<ManageAcceptanceWeighingRevisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAcceptanceWeighingRevisedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAcceptanceWeighingRevisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

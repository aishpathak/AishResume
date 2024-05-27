import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitInitialConsignmentComponent } from './submit-initial-consignment.component';

describe('SubmitInitialConsignmentComponent', () => {
  let component: SubmitInitialConsignmentComponent;
  let fixture: ComponentFixture<SubmitInitialConsignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitInitialConsignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitInitialConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

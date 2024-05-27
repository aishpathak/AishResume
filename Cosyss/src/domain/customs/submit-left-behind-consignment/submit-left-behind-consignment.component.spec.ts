import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitLeftBehindConsignmentComponent } from './submit-left-behind-consignment.component';

describe('SubmitLeftBehindConsignmentComponent', () => {
  let component: SubmitLeftBehindConsignmentComponent;
  let fixture: ComponentFixture<SubmitLeftBehindConsignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitLeftBehindConsignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitLeftBehindConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

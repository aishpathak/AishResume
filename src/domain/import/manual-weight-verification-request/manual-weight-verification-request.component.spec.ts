import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualWeightVerificationRequestComponent } from './manual-weight-verification-request.component';

describe('ManualWeightVerificationRequestComponent', () => {
  let component: ManualWeightVerificationRequestComponent;
  let fixture: ComponentFixture<ManualWeightVerificationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualWeightVerificationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualWeightVerificationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

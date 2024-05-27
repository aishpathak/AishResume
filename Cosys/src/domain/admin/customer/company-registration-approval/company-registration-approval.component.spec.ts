import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegistrationApprovalComponent } from './company-registration-approval.component';

describe('CompanyRegistrationApprovalComponent', () => {
  let component: CompanyRegistrationApprovalComponent;
  let fixture: ComponentFixture<CompanyRegistrationApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRegistrationApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRegistrationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

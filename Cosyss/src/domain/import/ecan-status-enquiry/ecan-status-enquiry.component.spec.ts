import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcanStatusEnquiryComponent } from './ecan-status-enquiry.component';

describe('EcanStatusEnquiryComponent', () => {
  let component: EcanStatusEnquiryComponent;
  let fixture: ComponentFixture<EcanStatusEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcanStatusEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcanStatusEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

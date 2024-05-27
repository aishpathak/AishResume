import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryLSPBYLocationComponent } from './enquiry-lspbylocation.component';

describe('EnquiryLSPBYLocationComponent', () => {
  let component: EnquiryLSPBYLocationComponent;
  let fixture: ComponentFixture<EnquiryLSPBYLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryLSPBYLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryLSPBYLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

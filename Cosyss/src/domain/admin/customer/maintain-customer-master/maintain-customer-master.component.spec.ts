import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCustomerMasterComponent } from './maintain-customer-master.component';

describe('MaintainCustomerMasterComponent', () => {
  let component: MaintainCustomerMasterComponent;
  let fixture: ComponentFixture<MaintainCustomerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainCustomerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainCustomerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

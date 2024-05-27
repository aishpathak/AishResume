import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsmessagelogdetailsComponent } from './customsmessagelogdetails.component';

describe('CustomsmessagelogdetailsComponent', () => {
  let component: CustomsmessagelogdetailsComponent;
  let fixture: ComponentFixture<CustomsmessagelogdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomsmessagelogdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsmessagelogdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

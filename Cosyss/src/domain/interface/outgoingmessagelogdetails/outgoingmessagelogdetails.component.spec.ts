import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingmessagelogdetailsComponent } from './outgoingmessagelogdetails.component';

describe('OutgoingmessagelogdetailsComponent', () => {
  let component: OutgoingmessagelogdetailsComponent;
  let fixture: ComponentFixture<OutgoingmessagelogdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingmessagelogdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingmessagelogdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

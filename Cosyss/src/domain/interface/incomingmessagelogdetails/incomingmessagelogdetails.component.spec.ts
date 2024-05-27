import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingmessagelogdetailsComponent } from './incomingmessagelogdetails.component';

describe('IncomingmessagelogdetailsComponent', () => {
  let component: IncomingmessagelogdetailsComponent;
  let fixture: ComponentFixture<IncomingmessagelogdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingmessagelogdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingmessagelogdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

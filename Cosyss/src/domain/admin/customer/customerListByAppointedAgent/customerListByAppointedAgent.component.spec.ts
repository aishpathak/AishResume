/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustomerListByAppointedAgentComponent } from './customerListByAppointedAgent.component';

describe('CustomerListByAppointedAgent.component.tsComponent', () => {
  let component: CustomerListByAppointedAgentComponent;
  let fixture: ComponentFixture<CustomerListByAppointedAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerListByAppointedAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListByAppointedAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

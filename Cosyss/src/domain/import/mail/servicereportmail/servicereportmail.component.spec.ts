import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicereportmailComponent } from './servicereportmail.component';

describe('ServicereportmailComponent', () => {
  let component: ServicereportmailComponent;
  let fixture: ComponentFixture<ServicereportmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicereportmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicereportmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

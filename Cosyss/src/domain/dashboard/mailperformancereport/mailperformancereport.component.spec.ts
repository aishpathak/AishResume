import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailperformancereportComponent } from './mailperformancereport.component';

describe('MailperformancereportComponent', () => {
  let component: MailperformancereportComponent;
  let fixture: ComponentFixture<MailperformancereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailperformancereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailperformancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailBagComponent } from './mail-bag.component';

describe('MailBagComponent', () => {
  let component: MailBagComponent;
  let fixture: ComponentFixture<MailBagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailBagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

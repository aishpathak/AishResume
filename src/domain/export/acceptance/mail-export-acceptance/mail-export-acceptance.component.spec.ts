import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailExportAcceptanceComponent } from './mail-export-acceptance.component';

describe('MailExportAcceptanceComponent', () => {
  let component: MailExportAcceptanceComponent;
  let fixture: ComponentFixture<MailExportAcceptanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailExportAcceptanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailExportAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

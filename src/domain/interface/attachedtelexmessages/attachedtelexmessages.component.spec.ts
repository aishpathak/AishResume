import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachedtelexmessagesComponent } from './attachedtelexmessages.component';

describe('AttachedtelexmessagesComponent', () => {
  let component: AttachedtelexmessagesComponent;
  let fixture: ComponentFixture<AttachedtelexmessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachedtelexmessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachedtelexmessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInboundMessageFileComponent } from './process-inbound-message-file.component';

describe('ProcessInboundMessageFileComponent', () => {
  let component: ProcessInboundMessageFileComponent;
  let fixture: ComponentFixture<ProcessInboundMessageFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessInboundMessageFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessInboundMessageFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

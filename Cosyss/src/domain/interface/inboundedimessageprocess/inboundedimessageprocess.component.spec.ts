import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundedimessageprocessComponent } from './inboundedimessageprocess.component';

describe('InboundedimessageprocessComponent', () => {
  let component: InboundedimessageprocessComponent;
  let fixture: ComponentFixture<InboundedimessageprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundedimessageprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundedimessageprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

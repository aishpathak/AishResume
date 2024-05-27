import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundFlightEFormsComponent } from './inbound-flight-eforms.component';

describe('InboundFlightEFormsComponent', () => {
  let component: InboundFlightEFormsComponent;
  let fixture: ComponentFixture<InboundFlightEFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundFlightEFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundFlightEFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

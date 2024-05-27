import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundBreakdownComponent } from './inbound-breakdown.component';

describe('InboundBreakdownComponent', () => {
  let component: InboundBreakdownComponent;
  let fixture: ComponentFixture<InboundBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

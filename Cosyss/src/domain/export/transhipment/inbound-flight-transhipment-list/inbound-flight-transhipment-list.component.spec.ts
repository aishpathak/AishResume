import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundFlightTranshipmentListComponent } from './inbound-flight-transhipment-list.component';

describe('InboundFlightTranshipmentListComponent', () => {
  let component: InboundFlightTranshipmentListComponent;
  let fixture: ComponentFixture<InboundFlightTranshipmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundFlightTranshipmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundFlightTranshipmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

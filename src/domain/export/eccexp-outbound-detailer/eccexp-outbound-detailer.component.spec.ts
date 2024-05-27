import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EccexpOutboundDetailerComponent } from './eccexp-outbound-detailer.component';

describe('EccexpOutboundDetailerComponent', () => {
  let component: EccexpOutboundDetailerComponent;
  let fixture: ComponentFixture<EccexpOutboundDetailerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EccexpOutboundDetailerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EccexpOutboundDetailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

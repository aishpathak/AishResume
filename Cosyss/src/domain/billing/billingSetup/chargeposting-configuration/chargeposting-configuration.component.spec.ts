import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargepostingConfigurationComponent } from './chargeposting-configuration.component';

describe('ChargepostingConfigurationComponent', () => {
  let component: ChargepostingConfigurationComponent;
  let fixture: ComponentFixture<ChargepostingConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargepostingConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargepostingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

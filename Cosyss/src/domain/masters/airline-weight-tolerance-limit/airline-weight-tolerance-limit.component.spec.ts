import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineWeightToleranceLimitComponent } from './airline-weight-tolerance-limit.component';

describe('AirlineWeightToleranceLimitComponent', () => {
  let component: AirlineWeightToleranceLimitComponent;
  let fixture: ComponentFixture<AirlineWeightToleranceLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineWeightToleranceLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineWeightToleranceLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

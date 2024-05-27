import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreWaivingParkingComponent } from './pre-waiving-parking.component';

describe('PreWaivingParkingComponent', () => {
  let component: PreWaivingParkingComponent;
  let fixture: ComponentFixture<PreWaivingParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreWaivingParkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreWaivingParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

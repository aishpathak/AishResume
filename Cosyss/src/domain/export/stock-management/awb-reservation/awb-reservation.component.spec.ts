import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbReservationComponent } from './awb-reservation.component';

describe('AwbReservationComponent', () => {
  let component: AwbReservationComponent;
  let fixture: ComponentFixture<AwbReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwbReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

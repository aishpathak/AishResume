import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveTruckDockComponent } from './reserve-truck-dock.component';

describe('ReserveTruckDockComponent', () => {
  let component: ReserveTruckDockComponent;
  let fixture: ComponentFixture<ReserveTruckDockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveTruckDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveTruckDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

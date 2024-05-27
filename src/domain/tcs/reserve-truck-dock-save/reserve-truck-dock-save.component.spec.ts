import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveTruckDockSaveComponent } from './reserve-truck-dock-save.component';

describe('ReserveTruckDockSaveComponent', () => {
  let component: ReserveTruckDockSaveComponent;
  let fixture: ComponentFixture<ReserveTruckDockSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveTruckDockSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveTruckDockSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

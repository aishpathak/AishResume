import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTruckDockComponent } from './maintain-truck-dock.component';

describe('MaintainTruckDockComponent', () => {
  let component: MaintainTruckDockComponent;
  let fixture: ComponentFixture<MaintainTruckDockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainTruckDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTruckDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

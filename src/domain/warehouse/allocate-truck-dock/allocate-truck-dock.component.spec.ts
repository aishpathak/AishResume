import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateTruckDockComponent } from './allocate-truck-dock.component';

describe('AllocateTruckDockComponent', () => {
  let component: AllocateTruckDockComponent;
  let fixture: ComponentFixture<AllocateTruckDockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateTruckDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateTruckDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

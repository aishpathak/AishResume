import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnreserveTruckDockComponent } from './unreserve-truck-dock.component';

describe('UnreserveTruckDockComponent', () => {
  let component: UnreserveTruckDockComponent;
  let fixture: ComponentFixture<UnreserveTruckDockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnreserveTruckDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnreserveTruckDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

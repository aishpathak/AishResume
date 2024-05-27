import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTruckDockComponent } from './release-truck-dock.component';

describe('ReleaseTruckDockComponent', () => {
  let component: ReleaseTruckDockComponent;
  let fixture: ComponentFixture<ReleaseTruckDockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseTruckDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseTruckDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

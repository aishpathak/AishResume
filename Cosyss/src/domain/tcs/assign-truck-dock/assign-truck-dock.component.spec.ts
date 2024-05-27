import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTruckDockComponent } from './assign-truck-dock.component';

describe('AssignTruckDockComponent', () => {
  let component: AssignTruckDockComponent;
  let fixture: ComponentFixture<AssignTruckDockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignTruckDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTruckDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

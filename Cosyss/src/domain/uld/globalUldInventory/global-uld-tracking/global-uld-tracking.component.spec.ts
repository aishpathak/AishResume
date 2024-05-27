import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalUldTrackingComponent } from './global-uld-tracking.component';

describe('GlobalUldTrackingComponent', () => {
  let component: GlobalUldTrackingComponent;
  let fixture: ComponentFixture<GlobalUldTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalUldTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalUldTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

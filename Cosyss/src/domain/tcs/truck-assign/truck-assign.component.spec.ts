import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckAssignComponent } from './truck-assign.component';

describe('TruckAssignComponent', () => {
  let component: TruckAssignComponent;
  let fixture: ComponentFixture<TruckAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

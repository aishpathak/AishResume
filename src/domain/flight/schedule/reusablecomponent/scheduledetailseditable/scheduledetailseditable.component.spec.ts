import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledetailseditableComponent } from './scheduledetailseditable.component';

describe('ScheduledetailseditableComponent', () => {
  let component: ScheduledetailseditableComponent;
  let fixture: ComponentFixture<ScheduledetailseditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledetailseditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledetailseditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

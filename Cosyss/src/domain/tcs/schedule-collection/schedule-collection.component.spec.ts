import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCollectionComponent } from './schedule-collection.component';

describe('ScheduleCollectionComponent', () => {
  let component: ScheduleCollectionComponent;
  let fixture: ComponentFixture<ScheduleCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

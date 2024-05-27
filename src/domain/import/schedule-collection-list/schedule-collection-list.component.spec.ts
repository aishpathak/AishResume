import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCollectionListComponent } from './schedule-collection-list.component';

describe('ScheduleCollectionListComponent', () => {
  let component: ScheduleCollectionListComponent;
  let fixture: ComponentFixture<ScheduleCollectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleCollectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

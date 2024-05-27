import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainScheduleCollectionMasterComponent } from './maintain-schedule-collection-master.component';

describe('MaintainScheduleCollectionMasterComponent', () => {
  let component: MaintainScheduleCollectionMasterComponent;
  let fixture: ComponentFixture<MaintainScheduleCollectionMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainScheduleCollectionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainScheduleCollectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

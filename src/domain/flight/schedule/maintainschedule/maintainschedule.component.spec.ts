import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainscheduleComponent } from './maintainschedule.component';

describe('MaintainscheduleComponent', () => {
  let component: MaintainscheduleComponent;
  let fixture: ComponentFixture<MaintainscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

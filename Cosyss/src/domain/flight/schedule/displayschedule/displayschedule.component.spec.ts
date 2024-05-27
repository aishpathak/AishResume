import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayscheduleComponent } from './displayschedule.component';

describe('DisplayscheduleComponent', () => {
  let component: DisplayscheduleComponent;
  let fixture: ComponentFixture<DisplayscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

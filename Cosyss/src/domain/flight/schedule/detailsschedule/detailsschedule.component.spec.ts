import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsscheduleComponent } from './detailsschedule.component';

describe('DetailsscheduleComponent', () => {
  let component: DetailsscheduleComponent;
  let fixture: ComponentFixture<DetailsscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

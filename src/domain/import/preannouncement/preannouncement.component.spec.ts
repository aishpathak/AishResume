import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreannouncementComponent } from './preannouncement.component';

describe('PreannouncementComponent', () => {
  let component: PreannouncementComponent;
  let fixture: ComponentFixture<PreannouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreannouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreannouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

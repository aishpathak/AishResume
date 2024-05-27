import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureTimeStampComponent } from './capture-time-stamp.component';

describe('CaptureTimeStampComponent', () => {
  let component: CaptureTimeStampComponent;
  let fixture: ComponentFixture<CaptureTimeStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptureTimeStampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureTimeStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

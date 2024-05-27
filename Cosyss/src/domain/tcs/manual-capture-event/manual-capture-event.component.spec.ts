import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualCaptureEventComponent } from './manual-capture-event.component';

describe('ManualCaptureEventComponent', () => {
  let component: ManualCaptureEventComponent;
  let fixture: ComponentFixture<ManualCaptureEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualCaptureEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualCaptureEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

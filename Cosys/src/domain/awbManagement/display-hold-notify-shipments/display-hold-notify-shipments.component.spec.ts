import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayHoldNotifyShipmentsComponent } from './display-hold-notify-shipments.component';

describe('DisplayHoldNotifyShipmentsComponent', () => {
  let component: DisplayHoldNotifyShipmentsComponent;
  let fixture: ComponentFixture<DisplayHoldNotifyShipmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayHoldNotifyShipmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayHoldNotifyShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

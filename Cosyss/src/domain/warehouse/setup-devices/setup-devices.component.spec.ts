import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDevicesComponent } from './setup-devices.component';

describe('SetupDevicesComponent', () => {
  let component: SetupDevicesComponent;
  let fixture: ComponentFixture<SetupDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

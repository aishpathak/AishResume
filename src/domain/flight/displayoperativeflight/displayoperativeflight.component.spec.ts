import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayoperativeflightComponent } from './displayoperativeflight.component';

describe('DisplayoperativeflightComponent', () => {
  let component: DisplayoperativeflightComponent;
  let fixture: ComponentFixture<DisplayoperativeflightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayoperativeflightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayoperativeflightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

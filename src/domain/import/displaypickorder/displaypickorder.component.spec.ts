import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaypickorderComponent } from './displaypickorder.component';

describe('DisplaypickorderComponent', () => {
  let component: DisplaypickorderComponent;
  let fixture: ComponentFixture<DisplaypickorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaypickorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaypickorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

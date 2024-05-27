import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAbandonedCargoComponent } from './display-abandoned-cargo.component';

describe('DisplayAbandonedCargoComponent', () => {
  let component: DisplayAbandonedCargoComponent;
  let fixture: ComponentFixture<DisplayAbandonedCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayAbandonedCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAbandonedCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

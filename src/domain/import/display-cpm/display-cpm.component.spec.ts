import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCpmComponent } from './display-cpm.component';

describe('DisplayCpmComponent', () => {
  let component: DisplayCpmComponent;
  let fixture: ComponentFixture<DisplayCpmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayCpmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayCpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

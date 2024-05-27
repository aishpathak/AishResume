import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayffmComponent } from './displayffm.component';

describe('DisplayffmComponent', () => {
  let component: DisplayffmComponent;
  let fixture: ComponentFixture<DisplayffmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayffmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayffmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

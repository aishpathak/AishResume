import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsighteduldComponent } from './unsighteduld.component';

describe('UnsighteduldComponent', () => {
  let component: UnsighteduldComponent;
  let fixture: ComponentFixture<UnsighteduldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsighteduldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsighteduldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

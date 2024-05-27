import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncollectedfreightoutComponent } from './uncollectedfreightout.component';

describe('UncollectedfreightoutComponent', () => {
  let component: UncollectedfreightoutComponent;
  let fixture: ComponentFixture<UncollectedfreightoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncollectedfreightoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncollectedfreightoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

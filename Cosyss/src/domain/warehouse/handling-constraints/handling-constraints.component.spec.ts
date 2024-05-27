import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandlingConstraintsComponent } from './handling-constraints.component';

describe('HandlingConstraintsComponent', () => {
  let component: HandlingConstraintsComponent;
  let fixture: ComponentFixture<HandlingConstraintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandlingConstraintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandlingConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

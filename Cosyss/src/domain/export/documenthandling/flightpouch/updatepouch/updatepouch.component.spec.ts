import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepouchComponent } from './updatepouch.component';

describe('UpdatepouchComponent', () => {
  let component: UpdatepouchComponent;
  let fixture: ComponentFixture<UpdatepouchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatepouchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatepouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

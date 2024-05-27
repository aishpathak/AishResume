import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelaystatusComponent } from './delaystatus.component';

describe('DelaystatusComponent', () => {
  let component: DelaystatusComponent;
  let fixture: ComponentFixture<DelaystatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelaystatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelaystatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

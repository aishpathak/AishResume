import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedNotocComponent } from './revised-notoc.component';

describe('RevisedNotocComponent', () => {
  let component: RevisedNotocComponent;
  let fixture: ComponentFixture<RevisedNotocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisedNotocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedNotocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

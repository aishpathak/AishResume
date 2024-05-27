import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkinglistComponent } from './workinglist.component';

describe('WorkinglistComponent', () => {
  let component: WorkinglistComponent;
  let fixture: ComponentFixture<WorkinglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkinglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

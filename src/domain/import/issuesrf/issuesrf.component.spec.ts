import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesrfComponent } from './issuesrf.component';

describe('IssuesrfComponent', () => {
  let component: IssuesrfComponent;
  let fixture: ComponentFixture<IssuesrfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesrfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuepoComponent } from './issuepo.component';

describe('IssuepoComponent', () => {
  let component: IssuepoComponent;
  let fixture: ComponentFixture<IssuepoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuepoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

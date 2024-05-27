import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignrolefunctionComponent } from './assignrolefunction.component';

describe('AssignrolefunctionComponent', () => {
  let component: AssignrolefunctionComponent;
  let fixture: ComponentFixture<AssignrolefunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignrolefunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignrolefunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

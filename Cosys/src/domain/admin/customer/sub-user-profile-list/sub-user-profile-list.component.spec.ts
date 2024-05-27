import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubUserProfileListComponent } from './sub-user-profile-list.component';

describe('SubUserProfileListComponent', () => {
  let component: SubUserProfileListComponent;
  let fixture: ComponentFixture<SubUserProfileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubUserProfileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubUserProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

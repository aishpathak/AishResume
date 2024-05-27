import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCertificationListComponent } from './user-certification-list.component';

describe('UserCertificationListComponent', () => {
  let component: UserCertificationListComponent;
  let fixture: ComponentFixture<UserCertificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCertificationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCertificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

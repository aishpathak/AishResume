import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftBehindManagementComponent } from './left-behind-management.component';

describe('LeftBehindManagementComponent', () => {
  let component: LeftBehindManagementComponent;
  let fixture: ComponentFixture<LeftBehindManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftBehindManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftBehindManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

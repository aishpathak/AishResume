import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbManagementComponent } from './awb-management.component';

describe('AwbManagementComponent', () => {
  let component: AwbManagementComponent;
  let fixture: ComponentFixture<AwbManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwbManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

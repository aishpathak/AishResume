import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainserviceproviderComponent } from './maintainserviceprovider.component';

describe('MaintainserviceproviderComponent', () => {
  let component: MaintainserviceproviderComponent;
  let fixture: ComponentFixture<MaintainserviceproviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainserviceproviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainserviceproviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

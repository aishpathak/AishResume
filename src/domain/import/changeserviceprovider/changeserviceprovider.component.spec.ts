import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeserviceproviderComponent } from './changeserviceprovider.component';

describe('ChangeserviceproviderComponent', () => {
  let component: ChangeserviceproviderComponent;
  let fixture: ComponentFixture<ChangeserviceproviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeserviceproviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeserviceproviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

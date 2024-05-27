import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RclsummaryComponent } from './rclsummary.component';

describe('RclsummaryComponent', () => {
  let component: RclsummaryComponent;
  let fixture: ComponentFixture<RclsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RclsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RclsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

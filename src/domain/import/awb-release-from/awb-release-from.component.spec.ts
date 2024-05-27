import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbReleaseFromComponent } from './awb-release-from.component';

describe('AwbReleaseFromComponent', () => {
  let component: AwbReleaseFromComponent;
  let fixture: ComponentFixture<AwbReleaseFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwbReleaseFromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbReleaseFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

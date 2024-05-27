import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDlsVarianceComponent } from './display-dls-variance.component';

describe('DisplayDlsVarianceComponent', () => {
  let component: DisplayDlsVarianceComponent;
  let fixture: ComponentFixture<DisplayDlsVarianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayDlsVarianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDlsVarianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

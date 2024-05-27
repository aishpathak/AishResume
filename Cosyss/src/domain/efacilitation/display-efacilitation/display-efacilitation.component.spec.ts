import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEfacilitationComponent } from './display-efacilitation.component';

describe('DisplayEfacilitationComponent', () => {
  let component: DisplayEfacilitationComponent;
  let fixture: ComponentFixture<DisplayEfacilitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEfacilitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEfacilitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

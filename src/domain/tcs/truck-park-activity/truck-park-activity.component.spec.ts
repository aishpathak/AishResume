import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckParkActivityComponent } from './truck-park-activity.component';

describe('TruckParkActivityComponent', () => {
  let component: TruckParkActivityComponent;
  let fixture: ComponentFixture<TruckParkActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckParkActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckParkActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

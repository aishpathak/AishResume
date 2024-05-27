import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckActivityComponent } from './truck-activity.component';

describe('TruckActivityComponent', () => {
  let component: TruckActivityComponent;
  let fixture: ComponentFixture<TruckActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TruckActivityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

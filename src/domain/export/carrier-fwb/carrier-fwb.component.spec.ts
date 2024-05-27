import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierFWBComponent } from './carrier-fwb.component';

describe('CarrierFWBComponent', () => {
  let component: CarrierFWBComponent;
  let fixture: ComponentFixture<CarrierFWBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierFWBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierFWBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

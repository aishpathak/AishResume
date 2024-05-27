import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckQueuingInfoComponent } from './truck-queuing-info.component';

describe('TruckQueuingInfoComponent', () => {
  let component: TruckQueuingInfoComponent;
  let fixture: ComponentFixture<TruckQueuingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckQueuingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckQueuingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

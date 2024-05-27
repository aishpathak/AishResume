import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectingTruckComponent } from './connecting-truck.component';

describe('ConnectingTruckComponent', () => {
  let component: ConnectingTruckComponent;
  let fixture: ComponentFixture<ConnectingTruckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectingTruckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectingTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

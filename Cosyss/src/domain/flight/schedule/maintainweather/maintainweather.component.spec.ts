import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainweatherComponent } from './maintainweather.component';

describe('MaintainweatherComponent', () => {
  let component: MaintainweatherComponent;
  let fixture: ComponentFixture<MaintainweatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainweatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainweatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

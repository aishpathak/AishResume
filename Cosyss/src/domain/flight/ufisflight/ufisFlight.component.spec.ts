import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UfisFlightComponent } from './ufisFlight.component';

describe('UfisFlightComponent', () => {
  let component: UfisFlightComponent;
  let fixture: ComponentFixture<UfisFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UfisFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UfisFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

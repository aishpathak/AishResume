import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseUncloseFlightComponent } from './close-unclose-flight.component';

describe('CloseUncloseFlightComponent', () => {
  let component: CloseUncloseFlightComponent;
  let fixture: ComponentFixture<CloseUncloseFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseUncloseFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseUncloseFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

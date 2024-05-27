import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUldFlightComponent } from './assign-uld-flight.component';

describe('AssignUldFlightComponent', () => {
  let component: AssignUldFlightComponent;
  let fixture: ComponentFixture<AssignUldFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignUldFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUldFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

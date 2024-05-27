import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineLoadingInstructionsComponent } from './airline-loading-instructions.component';

describe('AirlineLoadingInstructionsComponent', () => {
  let component: AirlineLoadingInstructionsComponent;
  let fixture: ComponentFixture<AirlineLoadingInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineLoadingInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineLoadingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

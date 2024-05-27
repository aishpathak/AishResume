import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownHandlingInformationComponent } from './breakdown-handling-information.component';

describe('BreakdownHandlingInformationComponent', () => {
  let component: BreakdownHandlingInformationComponent;
  let fixture: ComponentFixture<BreakdownHandlingInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakdownHandlingInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakdownHandlingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

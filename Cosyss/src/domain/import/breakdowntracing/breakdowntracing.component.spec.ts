import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdowntracingComponent } from './breakdowntracing.component';

describe('BreakdowntracingComponent', () => {
  let component: BreakdowntracingComponent;
  let fixture: ComponentFixture<BreakdowntracingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreakdowntracingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakdowntracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

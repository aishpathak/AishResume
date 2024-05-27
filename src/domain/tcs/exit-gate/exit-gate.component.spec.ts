import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitGateComponent } from './exit-gate.component';

describe('ExitGateComponent', () => {
  let component: ExitGateComponent;
  let fixture: ComponentFixture<ExitGateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitGateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

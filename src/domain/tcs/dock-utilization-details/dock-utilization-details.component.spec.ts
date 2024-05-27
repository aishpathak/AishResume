import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockUtilizationDetailsComponent } from './dock-utilization-details.component';

describe('DockUtilizationDetailsComponent', () => {
  let component: DockUtilizationDetailsComponent;
  let fixture: ComponentFixture<DockUtilizationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockUtilizationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockUtilizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

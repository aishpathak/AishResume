import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotecargoComponent } from './promotecargo.component';

describe('PromotecargoComponent', () => {
  let component: PromotecargoComponent;
  let fixture: ComponentFixture<PromotecargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotecargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotecargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightLoadStatementComponent } from './weight-load-statement.component';

describe('WeightLoadStatementComponent', () => {
  let component: WeightLoadStatementComponent;
  let fixture: ComponentFixture<WeightLoadStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightLoadStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightLoadStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

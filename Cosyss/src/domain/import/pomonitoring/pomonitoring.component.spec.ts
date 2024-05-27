import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PomonitoringComponent } from './pomonitoring.component';

describe('PomonitoringComponent', () => {
  let component: PomonitoringComponent;
  let fixture: ComponentFixture<PomonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PomonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

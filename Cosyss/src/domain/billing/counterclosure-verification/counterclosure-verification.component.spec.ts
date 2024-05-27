import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterclosureVerificationComponent } from './counterclosure-verification.component';

describe('CounterclosureVerificationComponent', () => {
  let component: CounterclosureVerificationComponent;
  let fixture: ComponentFixture<CounterclosureVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterclosureVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterclosureVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsnDtlComponent } from './psn-dtl.component';

describe('PsnDtlComponent', () => {
  let component: PsnDtlComponent;
  let fixture: ComponentFixture<PsnDtlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsnDtlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsnDtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

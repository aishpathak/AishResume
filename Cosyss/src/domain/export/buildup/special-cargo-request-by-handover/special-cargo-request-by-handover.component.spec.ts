import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCargoRequestByHandoverComponent } from './special-cargo-request-by-handover.component';

describe('SpecialCargoRequestByHandoverComponent', () => {
  let component: SpecialCargoRequestByHandoverComponent;
  let fixture: ComponentFixture<SpecialCargoRequestByHandoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialCargoRequestByHandoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCargoRequestByHandoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

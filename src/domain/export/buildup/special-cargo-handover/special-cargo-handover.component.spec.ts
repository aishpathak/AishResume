import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCargoHandoverComponent } from './special-cargo-handover.component';

describe('SpecialCargoHandoverComponent', () => {
  let component: SpecialCargoHandoverComponent;
  let fixture: ComponentFixture<SpecialCargoHandoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialCargoHandoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCargoHandoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOfCodeComponent } from './change-of-code.component';

describe('ChangeOfCodeComponent', () => {
  let component: ChangeOfCodeComponent;
  let fixture: ComponentFixture<ChangeOfCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOfCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOfCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

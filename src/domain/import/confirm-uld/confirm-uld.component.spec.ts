import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUldComponent } from './confirm-uld.component';

describe('ConfirmUldComponent', () => {
  let component: ConfirmUldComponent;
  let fixture: ComponentFixture<ConfirmUldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmUldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

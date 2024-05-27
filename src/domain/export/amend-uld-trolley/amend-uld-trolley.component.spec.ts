import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendUldTrolleyComponent } from './amend-uld-trolley.component';

describe('AmendUldTrolleyComponent', () => {
  let component: AmendUldTrolleyComponent;
  let fixture: ComponentFixture<AmendUldTrolleyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendUldTrolleyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendUldTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

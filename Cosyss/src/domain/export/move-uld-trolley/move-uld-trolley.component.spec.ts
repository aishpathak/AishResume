import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveUldTrolleyComponent } from './move-uld-trolley.component';

describe('MoveUldTrolleyComponent', () => {
  let component: MoveUldTrolleyComponent;
  let fixture: ComponentFixture<MoveUldTrolleyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveUldTrolleyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveUldTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

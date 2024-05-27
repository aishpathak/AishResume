import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpFblComponent } from './add-exp-fbl.component';

describe('AddExpFblComponent', () => {
  let component: AddExpFblComponent;
  let fixture: ComponentFixture<AddExpFblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExpFblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpFblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

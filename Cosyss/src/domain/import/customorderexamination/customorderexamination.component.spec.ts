import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomorderexaminationComponent } from './customorderexamination.component';

describe('CustomorderexaminationComponent', () => {
  let component: CustomorderexaminationComponent;
  let fixture: ComponentFixture<CustomorderexaminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomorderexaminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomorderexaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

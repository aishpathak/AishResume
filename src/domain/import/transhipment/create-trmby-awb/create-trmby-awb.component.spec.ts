import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrmbyAwbComponent } from './create-trmby-awb.component';

describe('CreateTrmbyAwbComponent', () => {
  let component: CreateTrmbyAwbComponent;
  let fixture: ComponentFixture<CreateTrmbyAwbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrmbyAwbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrmbyAwbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

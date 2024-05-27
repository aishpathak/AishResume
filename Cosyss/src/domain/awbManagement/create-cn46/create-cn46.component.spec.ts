import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCn46Component } from './create-cn46.component';

describe('CreateCn46Component', () => {
  let component: CreateCn46Component;
  let fixture: ComponentFixture<CreateCn46Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCn46Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCn46Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

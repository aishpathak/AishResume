import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEorderComponent } from './create-eorder.component';

describe('CreateEorderComponent', () => {
  let component: CreateEorderComponent;
  let fixture: ComponentFixture<CreateEorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEorderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

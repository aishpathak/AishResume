import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBanComponent } from './create-ban.component';

describe('CreateBanComponent', () => {
  let component: CreateBanComponent;
  let fixture: ComponentFixture<CreateBanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

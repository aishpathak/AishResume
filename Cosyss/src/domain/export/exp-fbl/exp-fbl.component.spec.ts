import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpFBLComponent } from './exp-fbl.component';

describe('ExpFBLComponent', () => {
  let component: ExpFBLComponent;
  let fixture: ComponentFixture<ExpFBLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpFBLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpFBLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDolliesBTComponent } from './request-dollies-bt.component';

describe('RequestDolliesBTComponent', () => {
  let component: RequestDolliesBTComponent;
  let fixture: ComponentFixture<RequestDolliesBTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDolliesBTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDolliesBTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

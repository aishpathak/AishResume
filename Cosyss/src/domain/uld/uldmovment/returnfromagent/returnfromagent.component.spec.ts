import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnfromagentComponent } from './returnfromagent.component';

describe('ReturnfromagentComponent', () => {
  let component: ReturnfromagentComponent;
  let fixture: ComponentFixture<ReturnfromagentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnfromagentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnfromagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

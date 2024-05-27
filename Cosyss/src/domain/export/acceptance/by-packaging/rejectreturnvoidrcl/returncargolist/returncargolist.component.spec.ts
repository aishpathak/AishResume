import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturncargolistComponent } from './returncargolist.component';

describe('ReturncargolistComponent', () => {
  let component: ReturncargolistComponent;
  let fixture: ComponentFixture<ReturncargolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturncargolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturncargolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

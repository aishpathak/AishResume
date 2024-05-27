import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviveshipmentComponent } from './reviveshipment.component';

describe('ReviveshipmentComponent', () => {
  let component: ReviveshipmentComponent;
  let fixture: ComponentFixture<ReviveshipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviveshipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviveshipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

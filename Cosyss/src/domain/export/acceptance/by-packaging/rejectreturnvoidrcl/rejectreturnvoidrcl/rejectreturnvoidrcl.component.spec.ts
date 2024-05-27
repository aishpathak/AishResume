import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectreturnvoidrclComponent } from './rejectreturnvoidrcl.component';

describe('RejectreturnvoidrclComponent', () => {
  let component: RejectreturnvoidrclComponent;
  let fixture: ComponentFixture<RejectreturnvoidrclComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RejectreturnvoidrclComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectreturnvoidrclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

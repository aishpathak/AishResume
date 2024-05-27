import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUnpostSrfComponent } from './post-unpost-srf.component';

describe('PostUnpostSrfComponent', () => {
  let component: PostUnpostSrfComponent;
  let fixture: ComponentFixture<PostUnpostSrfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostUnpostSrfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostUnpostSrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

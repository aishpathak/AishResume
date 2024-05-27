import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseBanComponent } from './release-ban.component';

describe('ReleaseBanComponent', () => {
  let component: ReleaseBanComponent;
  let fixture: ComponentFixture<ReleaseBanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseBanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

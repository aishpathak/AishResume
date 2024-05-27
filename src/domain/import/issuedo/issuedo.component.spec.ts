import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedoComponent } from './issuedo.component';

describe('IssuedoComponent', () => {
  let component: IssuedoComponent;
  let fixture: ComponentFixture<IssuedoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuedoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

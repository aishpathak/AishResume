import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayoutgoingenroutementComponent } from './displayoutgoingenroutement.component';

describe('DisplayoutgoingenroutementComponent', () => {
  let component: DisplayoutgoingenroutementComponent;
  let fixture: ComponentFixture<DisplayoutgoingenroutementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayoutgoingenroutementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayoutgoingenroutementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

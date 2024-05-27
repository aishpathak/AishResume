import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsiComponent } from './osi.component';

describe('OsiComponent', () => {
  let component: OsiComponent;
  let fixture: ComponentFixture<OsiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

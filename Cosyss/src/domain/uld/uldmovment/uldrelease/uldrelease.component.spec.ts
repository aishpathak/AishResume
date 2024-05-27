import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldreleaseComponent } from './uldrelease.component';

describe('UldreleaseComponent', () => {
  let component: UldreleaseComponent;
  let fixture: ComponentFixture<UldreleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldreleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldreleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

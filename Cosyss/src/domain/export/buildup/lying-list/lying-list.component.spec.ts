/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LyingListComponent } from './lying-list.component';

describe('LyingListComponent', () => {
  let component: LyingListComponent;
  let fixture: ComponentFixture<LyingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LyingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LyingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

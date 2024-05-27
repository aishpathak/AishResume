/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SidListComponent } from './sid-list.component';

describe('SidListComponent', () => {
  let component: SidListComponent;
  let fixture: ComponentFixture<SidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

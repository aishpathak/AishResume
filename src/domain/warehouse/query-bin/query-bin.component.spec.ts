/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QueryBinComponent } from './query-bin.component';

describe('QueryBinComponent', () => {
  let component: QueryBinComponent;
  let fixture: ComponentFixture<QueryBinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryBinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

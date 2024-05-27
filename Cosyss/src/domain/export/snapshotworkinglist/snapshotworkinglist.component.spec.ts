/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SnapshotworkinglistComponent } from './snapshotworkinglist.component';

describe('SnapshotworkinglistComponent', () => {
  let component: SnapshotworkinglistComponent;
  let fixture: ComponentFixture<SnapshotworkinglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapshotworkinglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotworkinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

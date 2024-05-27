/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MssDashboardVideoWallComponent } from './mss-dashboard-videoWall.component';

describe('MssDashboardVideoWallComponent', () => {
  let component: MssDashboardVideoWallComponent;
  let fixture: ComponentFixture<MssDashboardVideoWallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MssDashboardVideoWallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MssDashboardVideoWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

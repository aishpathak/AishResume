/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExportMailManifestComponent } from './export-mail-manifest.component';

describe('ExportMailManifestComponent', () => {
  let component: ExportMailManifestComponent;
  let fixture: ComponentFixture<ExportMailManifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportMailManifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportMailManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImportManifestComponent } from './import-manifest.component';

describe('ImportManifestComponent', () => {
  let component: ImportManifestComponent;
  let fixture: ComponentFixture<ImportManifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportManifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

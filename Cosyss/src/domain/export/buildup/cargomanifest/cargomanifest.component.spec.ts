/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CargomanifestComponent } from './cargomanifest.component';

describe('CargomanifestComponent', () => {
  let component: CargomanifestComponent;
  let fixture: ComponentFixture<CargomanifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargomanifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargomanifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

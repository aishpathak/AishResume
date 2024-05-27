/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CargomanifestdeclerationComponent } from './cargomanifestdecleration.component';

describe('CargomanifestdeclerationComponent', () => {
  let component: CargomanifestdeclerationComponent;
  let fixture: ComponentFixture<CargomanifestdeclerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargomanifestdeclerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargomanifestdeclerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

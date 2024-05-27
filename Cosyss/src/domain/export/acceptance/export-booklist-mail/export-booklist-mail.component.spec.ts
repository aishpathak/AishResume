/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExportBooklistMailComponent } from './Export-Booklist-Mail.component';

describe('ExportBooklistMailComponent', () => {
  let component: ExportBooklistMailComponent;
  let fixture: ComponentFixture<ExportBooklistMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportBooklistMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportBooklistMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

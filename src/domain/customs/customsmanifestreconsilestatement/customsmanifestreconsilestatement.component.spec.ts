/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustomsmanifestreconsilestatementComponent } from './customsmanifestreconsilestatement.component';

describe('CustomsmanifestreconsilestatementComponent', () => {
  let component: CustomsmanifestreconsilestatementComponent;
  let fixture: ComponentFixture<CustomsmanifestreconsilestatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomsmanifestreconsilestatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsmanifestreconsilestatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ElectronicConsignmentSecurityDeclarationComponent } from './electronic-consignment-security-declaration.component';

describe('ElectronicConsignmentSecurityDeclarationComponent', () => {
  let component: ElectronicConsignmentSecurityDeclarationComponent;
  let fixture: ComponentFixture<ElectronicConsignmentSecurityDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectronicConsignmentSecurityDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectronicConsignmentSecurityDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

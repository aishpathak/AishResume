import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacingSyetmTelexaddressSetupComponent } from './interfacing-syetm-telexaddress-setup.component';

describe('InterfacingSyetmTelexaddressSetupComponent', () => {
  let component: InterfacingSyetmTelexaddressSetupComponent;
  let fixture: ComponentFixture<InterfacingSyetmTelexaddressSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacingSyetmTelexaddressSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacingSyetmTelexaddressSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

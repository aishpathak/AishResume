import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ULDLSPComponent } from './uldlsp.component';

describe('ULDLSPComponent', () => {
  let component: ULDLSPComponent;
  let fixture: ComponentFixture<ULDLSPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ULDLSPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ULDLSPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

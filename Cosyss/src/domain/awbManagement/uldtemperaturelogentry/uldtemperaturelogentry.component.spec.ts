import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldtemperaturelogentryComponent } from './uldtemperaturelogentry.component';

describe('UldtemperaturelogentryComponent', () => {
  let component: UldtemperaturelogentryComponent;
  let fixture: ComponentFixture<UldtemperaturelogentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldtemperaturelogentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldtemperaturelogentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

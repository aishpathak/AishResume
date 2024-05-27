import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFlightEVMSlaTVComponent } from './import-FlightEVM-SlaTV.component';

describe('ImportFlightEVMSlaTVComponent', () => {
  let component: ImportFlightEVMSlaTVComponent;
  let fixture: ComponentFixture<ImportFlightEVMSlaTVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFlightEVMSlaTVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFlightEVMSlaTVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

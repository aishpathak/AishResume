import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAwbBarCodeComponent } from './print-awb-bar-code.component';

describe('PrintAwbBarCodeComponent', () => {
  let component: PrintAwbBarCodeComponent;
  let fixture: ComponentFixture<PrintAwbBarCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAwbBarCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAwbBarCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

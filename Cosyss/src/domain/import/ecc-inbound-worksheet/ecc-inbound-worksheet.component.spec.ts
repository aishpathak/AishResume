import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EccInboundWorksheetComponent } from './ecc-inbound-worksheet.component';

describe('EccInboundWorksheetComponent', () => {
  let component: EccInboundWorksheetComponent;
  let fixture: ComponentFixture<EccInboundWorksheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EccInboundWorksheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EccInboundWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

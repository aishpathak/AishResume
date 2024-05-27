import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquireCustomsImpShpManualReqComponent } from './enquire-customs-imp-shp-manual-req.component';

describe('EnquireCustomsImpShpManualReqComponent', () => {
  let component: EnquireCustomsImpShpManualReqComponent;
  let fixture: ComponentFixture<EnquireCustomsImpShpManualReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquireCustomsImpShpManualReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquireCustomsImpShpManualReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsImpShpManualRequestComponent } from './customs-imp-shp-manual-request.component';

describe('CustomsImpShpManualRequestComponent', () => {
  let component: CustomsImpShpManualRequestComponent;
  let fixture: ComponentFixture<CustomsImpShpManualRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomsImpShpManualRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsImpShpManualRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

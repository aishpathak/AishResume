import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldMaintainMovableLocationTypesComponent } from './uld-maintain-movable-location-types.component';

describe('UldMaintainMovableLocationTypesComponent', () => {
  let component: UldMaintainMovableLocationTypesComponent;
  let fixture: ComponentFixture<UldMaintainMovableLocationTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldMaintainMovableLocationTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldMaintainMovableLocationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

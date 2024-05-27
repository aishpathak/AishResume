import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseConfigurationSectorComponent } from './warehouse-configuration-sector.component';

describe('WarehouseConfigurationSectorComponent', () => {
  let component: WarehouseConfigurationSectorComponent;
  let fixture: ComponentFixture<WarehouseConfigurationSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseConfigurationSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseConfigurationSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

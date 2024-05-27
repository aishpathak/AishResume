import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloadShipmentComponent } from './unload-shipment.component';

describe('UnloadShipmentComponent', () => {
  let component: UnloadShipmentComponent;
  let fixture: ComponentFixture<UnloadShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnloadShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnloadShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

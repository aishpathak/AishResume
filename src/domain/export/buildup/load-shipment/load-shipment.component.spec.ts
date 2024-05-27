import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadShipmentComponent } from './load-shipment.component';

describe('LoadShipmentComponent', () => {
  let component: LoadShipmentComponent;
  let fixture: ComponentFixture<LoadShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

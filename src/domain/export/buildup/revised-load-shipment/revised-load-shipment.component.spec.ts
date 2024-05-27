import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedLoadShipmentComponent } from './revised-load-shipment.component';

describe('LoadShipmentComponent', () => {
  let component: RevisedLoadShipmentComponent;
  let fixture: ComponentFixture<RevisedLoadShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RevisedLoadShipmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedLoadShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkShipmentForReuseComponent } from './mark-shipment-for-reuse.component';

describe('MarkShipmentForReuseComponent', () => {
  let component: MarkShipmentForReuseComponent;
  let fixture: ComponentFixture<MarkShipmentForReuseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkShipmentForReuseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkShipmentForReuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

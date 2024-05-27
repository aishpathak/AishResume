import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferByCarrierComponent } from './transfer-by-carrier.component';

describe('TransferByCarrierComponent', () => {
  let component: TransferByCarrierComponent;
  let fixture: ComponentFixture<TransferByCarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferByCarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferByCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

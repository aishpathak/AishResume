import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCarrierCodeComponent } from './maintain-carrier-code.component';

describe('MaintainCarrierCodeComponent', () => {
  let component: MaintainCarrierCodeComponent;
  let fixture: ComponentFixture<MaintainCarrierCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainCarrierCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainCarrierCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

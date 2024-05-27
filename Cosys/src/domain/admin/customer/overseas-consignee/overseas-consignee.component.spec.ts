import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverseasConsigneeComponent } from './overseas-consignee.component';

describe('OverseasConsigneeComponent', () => {
  let component: OverseasConsigneeComponent;
  let fixture: ComponentFixture<OverseasConsigneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverseasConsigneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverseasConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

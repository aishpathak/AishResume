import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerbillingSetupComponent } from './customerbilling-setup.component';

describe('CustomerbillingSetupComponent', () => {
  let component: CustomerbillingSetupComponent;
  let fixture: ComponentFixture<CustomerbillingSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerbillingSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerbillingSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

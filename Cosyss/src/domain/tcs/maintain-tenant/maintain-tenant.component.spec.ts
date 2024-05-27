import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTenantComponent } from './maintain-tenant.component';

describe('MaintainTenantComponent', () => {
  let component: MaintainTenantComponent;
  let fixture: ComponentFixture<MaintainTenantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainTenantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantQueuingInformationComponent } from './tenant-queuing-information.component';

describe('TenantQueuingInformationComponent', () => {
  let component: TenantQueuingInformationComponent;
  let fixture: ComponentFixture<TenantQueuingInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantQueuingInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantQueuingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceErrorLogComponent } from './service-error-log.component';

describe('ServiceErrorLogComponent', () => {
  let component: ServiceErrorLogComponent;
  let fixture: ComponentFixture<ServiceErrorLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceErrorLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceErrorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

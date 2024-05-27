import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldmissingcargoComponent } from './uldmissingcargo.component';

describe('UldmissingcargoComponent', () => {
  let component: UldmissingcargoComponent;
  let fixture: ComponentFixture<UldmissingcargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldmissingcargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldmissingcargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

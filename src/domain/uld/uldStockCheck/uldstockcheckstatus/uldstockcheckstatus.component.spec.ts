import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldstockcheckstatusComponent } from './uldstockcheckstatus.component';

describe('UldstockcheckstatusComponent', () => {
  let component: UldstockcheckstatusComponent;
  let fixture: ComponentFixture<UldstockcheckstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldstockcheckstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldstockcheckstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

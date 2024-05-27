import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAccessoryUsageComponent } from './print-accessory-usage.component';

describe('PrintAccessoryUsageComponent', () => {
  let component: PrintAccessoryUsageComponent;
  let fixture: ComponentFixture<PrintAccessoryUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAccessoryUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAccessoryUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

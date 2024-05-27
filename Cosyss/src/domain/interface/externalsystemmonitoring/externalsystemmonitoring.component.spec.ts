import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalsystemmonitoringComponent } from './externalsystemmonitoring.component';

describe('ExternalsystemmonitoringComponent', () => {
  let component: ExternalsystemmonitoringComponent;
  let fixture: ComponentFixture<ExternalsystemmonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalsystemmonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalsystemmonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FwbLogComponent } from './fwb-log.component';

describe('FwbLogComponent', () => {
  let component: FwbLogComponent;
  let fixture: ComponentFixture<FwbLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FwbLogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FwbLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

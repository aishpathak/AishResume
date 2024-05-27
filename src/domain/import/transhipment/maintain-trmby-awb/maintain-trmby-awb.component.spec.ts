import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTrmbyAwbComponent } from './maintain-trmby-awb.component';

describe('MaintainTrmbyAwbComponent', () => {
  let component: MaintainTrmbyAwbComponent;
  let fixture: ComponentFixture<MaintainTrmbyAwbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainTrmbyAwbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTrmbyAwbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

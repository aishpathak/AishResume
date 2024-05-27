import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainRCLComponent } from './maintain-rcl.component';

describe('MaintainRCLComponent', () => {
  let component: MaintainRCLComponent;
  let fixture: ComponentFixture<MaintainRCLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainRCLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainRCLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

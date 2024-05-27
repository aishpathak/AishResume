import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSHCMasterComponent } from './maintainshcmaster.component';

describe('MaintainSHCMasterComponent', () => {
  let component: MaintainSHCMasterComponent;
  let fixture: ComponentFixture<MaintainSHCMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainSHCMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainSHCMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

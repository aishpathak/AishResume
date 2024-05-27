import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainHouseMasterComponent } from './maintain-house-master.component';

describe('MaintainHouseMasterComponent', () => {
  let component: MaintainHouseMasterComponent;
  let fixture: ComponentFixture<MaintainHouseMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainHouseMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainHouseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

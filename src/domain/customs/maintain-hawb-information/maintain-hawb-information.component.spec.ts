import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainHawbInformationComponent } from './maintain-hawb-information.component';

describe('MaintainHawbInformationComponent', () => {
  let component: MaintainHawbInformationComponent;
  let fixture: ComponentFixture<MaintainHawbInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainHawbInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainHawbInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

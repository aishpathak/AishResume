import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainBanInformationComponent } from './maintain-ban-information.component';

describe('MaintainBanInformationComponent', () => {
  let component: MaintainBanInformationComponent;
  let fixture: ComponentFixture<MaintainBanInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainBanInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainBanInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

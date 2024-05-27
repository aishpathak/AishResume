import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainHouseComponent } from './maintain-house.component';

describe('MaintainHouseComponent', () => {
  let component: MaintainHouseComponent;
  let fixture: ComponentFixture<MaintainHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

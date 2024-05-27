import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainHawbListComponent } from './maintain-hawb-list.component';

describe('MaintainHawbListComponent', () => {
  let component: MaintainHawbListComponent;
  let fixture: ComponentFixture<MaintainHawbListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainHawbListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainHawbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

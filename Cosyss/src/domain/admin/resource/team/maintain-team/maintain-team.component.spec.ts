import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTeamComponent } from './maintain-team.component';

describe('MaintainTeamComponent', () => {
  let component: MaintainTeamComponent;
  let fixture: ComponentFixture<MaintainTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

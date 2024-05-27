import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainNawbComponent } from './maintain-nawb.component';

describe('MaintainNawbComponent', () => {
  let component: MaintainNawbComponent;
  let fixture: ComponentFixture<MaintainNawbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainNawbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainNawbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

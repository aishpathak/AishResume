import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainEicComponent } from './maintain-eic.component';

describe('MaintainEicComponent', () => {
  let component: MaintainEicComponent;
  let fixture: ComponentFixture<MaintainEicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainEicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainEicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

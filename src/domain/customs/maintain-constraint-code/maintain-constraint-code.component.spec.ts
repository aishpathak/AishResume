import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainConstraintCodeComponent } from './maintain-constraint-code.component';

describe('MaintainConstraintCodeComponent', () => {
  let component: MaintainConstraintCodeComponent;
  let fixture: ComponentFixture<MaintainConstraintCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainConstraintCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainConstraintCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

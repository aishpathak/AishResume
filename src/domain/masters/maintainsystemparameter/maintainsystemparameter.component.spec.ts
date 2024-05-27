import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSystemParameterComponent } from './maintainsystemparameter.component';

describe('MaintainsystemparamterComponent', () => {
  let component: MaintainSystemParameterComponent;
  let fixture: ComponentFixture<MaintainSystemParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainSystemParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainSystemParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTermsComponent } from './maintainterms.component';

describe('MaintainTermsComponent', () => {
  let component: MaintainTermsComponent;
  let fixture: ComponentFixture<MaintainTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainRemarkComponent } from './maintain-remark.component';

describe('MaintainRemarkComponent', () => {
  let component: MaintainRemarkComponent;
  let fixture: ComponentFixture<MaintainRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

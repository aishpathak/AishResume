import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainairlinemasterComponent } from './maintainairlinemaster.component';

describe('MaintainairlinemasterComponent', () => {
  let component: MaintainairlinemasterComponent;
  let fixture: ComponentFixture<MaintainairlinemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainairlinemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainairlinemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

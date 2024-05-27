import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainairlineuldComponent } from './maintainairlineuld.component';

describe('MaintainairlineuldComponent', () => {
  let component: MaintainairlineuldComponent;
  let fixture: ComponentFixture<MaintainairlineuldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainairlineuldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainairlineuldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainAccsComponent } from './maintain-accs.component';

describe('MaintainAccsComponent', () => {
  let component: MaintainAccsComponent;
  let fixture: ComponentFixture<MaintainAccsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainAccsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainAccsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

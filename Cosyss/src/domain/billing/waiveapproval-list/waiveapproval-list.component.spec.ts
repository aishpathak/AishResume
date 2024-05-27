import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiveapprovalListComponent } from './waiveapproval-list.component';

describe('WaiveapprovalListComponent', () => {
  let component: WaiveapprovalListComponent;
  let fixture: ComponentFixture<WaiveapprovalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiveapprovalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiveapprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

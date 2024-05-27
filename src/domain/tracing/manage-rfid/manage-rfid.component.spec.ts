import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRfidComponent } from './manage-rfid.component';

describe('ManageRfidComponent', () => {
  let component: ManageRfidComponent;
  let fixture: ComponentFixture<ManageRfidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRfidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

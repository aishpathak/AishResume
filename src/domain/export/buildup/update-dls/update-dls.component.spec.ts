import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDlsComponent } from './update-dls.component';

describe('UpdateDlsComponent', () => {
  let component: UpdateDlsComponent;
  let fixture: ComponentFixture<UpdateDlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

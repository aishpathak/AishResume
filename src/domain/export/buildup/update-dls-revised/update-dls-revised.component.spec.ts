import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDlsRevisedComponent } from './update-dls-revised.component';

describe('UpdateDlsRevisedComponent', () => {
  let component: UpdateDlsRevisedComponent;
  let fixture: ComponentFixture<UpdateDlsRevisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDlsRevisedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDlsRevisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

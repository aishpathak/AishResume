import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldUcmComponent } from './uldUcm.component';

describe('UldUcmComponent', () => {
  let component: UldUcmComponent;
  let fixture: ComponentFixture<UldUcmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldUcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldUcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

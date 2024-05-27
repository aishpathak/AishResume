import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldtransferViewDataComponent } from './uldtransferviewdata.component';

describe('UldtransferViewDataComponent', () => {
  let component: UldtransferViewDataComponent;
  let fixture: ComponentFixture<UldtransferViewDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldtransferViewDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldtransferViewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

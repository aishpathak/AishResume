import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldtransferviewComponent } from './uldtransferview.component';

describe('UldtransferComponent', () => {
  let component: UldtransferviewComponent;
  let fixture: ComponentFixture<UldtransferviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldtransferviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldtransferviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

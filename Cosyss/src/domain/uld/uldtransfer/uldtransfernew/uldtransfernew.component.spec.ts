import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldtransfernewComponent } from './uldtransfernew.component';

describe('UldtransfernewComponent', () => {
  let component: UldtransfernewComponent;
  let fixture: ComponentFixture<UldtransfernewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldtransfernewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldtransfernewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

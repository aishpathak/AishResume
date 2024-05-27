import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldmissingapronComponent } from './uldmissingapron.component';

describe('UldmissingapronComponent', () => {
  let component: UldmissingapronComponent;
  let fixture: ComponentFixture<UldmissingapronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldmissingapronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldmissingapronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

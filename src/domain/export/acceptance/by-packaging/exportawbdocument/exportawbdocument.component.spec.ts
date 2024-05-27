import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportawbdocumentComponent } from './exportawbdocument.component';

describe('ExportawbdocumentComponent', () => {
  let component: ExportawbdocumentComponent;
  let fixture: ComponentFixture<ExportawbdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportawbdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportawbdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

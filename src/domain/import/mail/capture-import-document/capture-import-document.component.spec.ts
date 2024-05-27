import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureImportDocumentComponent } from './capture-import-document.component';

describe('CaptureImportDocumentComponent', () => {
  let component: CaptureImportDocumentComponent;
  let fixture: ComponentFixture<CaptureImportDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptureImportDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureImportDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

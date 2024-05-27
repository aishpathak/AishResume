import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeadministrationcodeComponent } from './codeadministrationcode.component';

describe('CodeadministrationcodeComponent', () => {
  let component: CodeadministrationcodeComponent;
  let fixture: ComponentFixture<CodeadministrationcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeadministrationcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeadministrationcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

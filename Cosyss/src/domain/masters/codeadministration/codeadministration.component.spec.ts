import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeadministrationComponent } from './codeadministration.component';

describe('CodeadministrationComponent', () => {
  let component: CodeadministrationComponent;
  let fixture: ComponentFixture<CodeadministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeadministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeadministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

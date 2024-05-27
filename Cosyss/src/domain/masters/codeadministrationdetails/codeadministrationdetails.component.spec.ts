import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeadministrationdetailsComponent } from './codeadministrationdetails.component';

describe('CodeadministrationdetailsComponent', () => {
  let component: CodeadministrationdetailsComponent;
  let fixture: ComponentFixture<CodeadministrationdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeadministrationdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeadministrationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

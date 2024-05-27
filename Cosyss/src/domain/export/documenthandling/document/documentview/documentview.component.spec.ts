import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentviewComponent } from './documentview.component';

describe('DocumentviewComponent', () => {
  let component: DocumentviewComponent;
  let fixture: ComponentFixture<DocumentviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

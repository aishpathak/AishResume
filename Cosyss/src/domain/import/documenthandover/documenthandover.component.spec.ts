import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenthandoverComponent } from './documenthandover.component';

describe('DocumenthandoverComponent', () => {
  let component: DocumenthandoverComponent;
  let fixture: ComponentFixture<DocumenthandoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumenthandoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenthandoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

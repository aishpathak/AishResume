import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenthandlingmasterComponent } from './documenthandlingmaster.component';

describe('DocumenthandlingmasterComponent', () => {
  let component: DocumenthandlingmasterComponent;
  let fixture: ComponentFixture<DocumenthandlingmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumenthandlingmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenthandlingmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

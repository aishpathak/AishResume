import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenthandlingmenuComponent } from './documenthandlingmenu.component';

describe('DocumenthandlingmenuComponent', () => {
  let component: DocumenthandlingmenuComponent;
  let fixture: ComponentFixture<DocumenthandlingmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumenthandlingmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenthandlingmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UlddeleteComponent } from './ulddelete.component';

describe('UlddeleteComponent', () => {
  let component: UlddeleteComponent;
  let fixture: ComponentFixture<UlddeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UlddeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlddeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

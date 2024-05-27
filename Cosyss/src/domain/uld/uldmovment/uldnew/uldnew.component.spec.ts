import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldnewComponent } from './uldnew.component';

describe('UldnewComponent', () => {
  let component: UldnewComponent;
  let fixture: ComponentFixture<UldnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

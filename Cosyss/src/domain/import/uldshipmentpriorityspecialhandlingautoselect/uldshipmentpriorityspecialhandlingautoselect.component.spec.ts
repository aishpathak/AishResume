import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldshipmentpriorityspecialhandlingautoselectComponent } from './uldshipmentpriorityspecialhandlingautoselect.component';

describe('UldshipmentpriorityspecialhandlingautoselectComponent', () => {
  let component: UldshipmentpriorityspecialhandlingautoselectComponent;
  let fixture: ComponentFixture<UldshipmentpriorityspecialhandlingautoselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldshipmentpriorityspecialhandlingautoselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldshipmentpriorityspecialhandlingautoselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldshipmentpriorityspecialcargohandlingComponent } from './uldshipmentpriorityspecialcargohandling.component';

describe('UldshipmentpriorityspecialcargohandlingComponent', () => {
  let component: UldshipmentpriorityspecialcargohandlingComponent;
  let fixture: ComponentFixture<UldshipmentpriorityspecialcargohandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldshipmentpriorityspecialcargohandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldshipmentpriorityspecialcargohandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

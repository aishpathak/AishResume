import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldagentComponent } from './uldagent.component';

describe('UldagentComponent', () => {
  let component: UldagentComponent;
  let fixture: ComponentFixture<UldagentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldagentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

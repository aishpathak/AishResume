import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSectorComponent } from './terminal-sector.component';

describe('TerminalSectorComponent', () => {
  let component: TerminalSectorComponent;
  let fixture: ComponentFixture<TerminalSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

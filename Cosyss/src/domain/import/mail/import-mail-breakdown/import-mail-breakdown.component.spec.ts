import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMailBreakdownComponent } from './import-mail-breakdown.component';

describe('ImportMailBreakdownComponent', () => {
  let component: ImportMailBreakdownComponent;
  let fixture: ComponentFixture<ImportMailBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportMailBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMailBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

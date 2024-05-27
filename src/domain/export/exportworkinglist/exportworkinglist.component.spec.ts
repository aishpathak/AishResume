import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportworkinglistComponent } from './exportworkinglist.component';

describe('ExportworkinglistComponent', () => {
  let component: ExportworkinglistComponent;
  let fixture: ComponentFixture<ExportworkinglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportworkinglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportworkinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

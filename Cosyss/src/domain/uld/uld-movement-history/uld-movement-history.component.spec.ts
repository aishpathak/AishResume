import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldMovementHistoryComponent } from './uld-movement-history.component';

describe('UldMovementHistoryComponent', () => {
  let component: UldMovementHistoryComponent;
  let fixture: ComponentFixture<UldMovementHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldMovementHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldMovementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

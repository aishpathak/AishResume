import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceweighingComponent } from './acceptanceweighing.component';

describe('AcceptanceweighingComponent', () => {
  let component: AcceptanceweighingComponent;
  let fixture: ComponentFixture<AcceptanceweighingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptanceweighingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceweighingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldallotmentComponent } from './uldallotment.component';

describe('UldallotmentComponent', () => {
  let component: UldallotmentComponent;
  let fixture: ComponentFixture<UldallotmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldallotmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldallotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceWeighingCargoDetailsComponent } from './acceptance-weighing-cargo-details.component';

describe('AcceptanceWeighingCargoDetailsComponent', () => {
  let component: AcceptanceWeighingCargoDetailsComponent;
  let fixture: ComponentFixture<AcceptanceWeighingCargoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptanceWeighingCargoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceWeighingCargoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

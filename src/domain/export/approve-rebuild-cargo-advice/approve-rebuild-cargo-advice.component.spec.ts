import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRebuildCargoAdviceComponent } from './approve-rebuild-cargo-advice.component';

describe('ApproveRebuildCargoAdviceComponent', () => {
  let component: ApproveRebuildCargoAdviceComponent;
  let fixture: ComponentFixture<ApproveRebuildCargoAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveRebuildCargoAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRebuildCargoAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

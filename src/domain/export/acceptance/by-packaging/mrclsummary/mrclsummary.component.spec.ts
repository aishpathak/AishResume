import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MRCLSummaryComponent } from './mrclsummary.component';

describe('MrclsummaryComponent', () => {
  let component: MRCLSummaryComponent;
  let fixture: ComponentFixture<MRCLSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MRCLSummaryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MRCLSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

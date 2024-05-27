import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuildCargoAdviceComponent } from './rebuild-cargo-advice.component';

describe('RebuildCargoAdviceComponent', () => {
  let component: RebuildCargoAdviceComponent;
  let fixture: ComponentFixture<RebuildCargoAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebuildCargoAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuildCargoAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

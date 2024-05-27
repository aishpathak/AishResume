import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalULDStockCheckComponent } from './global-uldstock-check.component';

describe('GlobalULDStockCheckComponent', () => {
  let component: GlobalULDStockCheckComponent;
  let fixture: ComponentFixture<GlobalULDStockCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalULDStockCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalULDStockCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

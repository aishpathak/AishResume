import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOccupancyComponent } from './company-occupancy.component';

describe('CompanyOccupancyComponent', () => {
  let component: CompanyOccupancyComponent;
  let fixture: ComponentFixture<CompanyOccupancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyOccupancyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyOccupancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

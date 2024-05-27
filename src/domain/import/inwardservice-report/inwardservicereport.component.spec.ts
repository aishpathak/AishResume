import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardservicereportComponent } from './inwardservicereport.component';

describe('InwardservicereportComponent', () => {
  let component: InwardservicereportComponent;
  let fixture: ComponentFixture<InwardservicereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardservicereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardservicereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

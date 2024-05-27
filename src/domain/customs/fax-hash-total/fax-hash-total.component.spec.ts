import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaxHashTotalComponent } from './fax-hash-total.component';

describe('FaxHashTotalComponent', () => {
  let component: FaxHashTotalComponent;
  let fixture: ComponentFixture<FaxHashTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaxHashTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaxHashTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

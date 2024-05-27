import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendDcDetailsComponent } from './amend-dc-details.component';

describe('AmendDcDetailsComponent', () => {
  let component: AmendDcDetailsComponent;
  let fixture: ComponentFixture<AmendDcDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendDcDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendDcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

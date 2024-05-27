import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnfromworkshopComponent } from './returnfromworkshop.component';

describe('ReturnfromworkshopComponent', () => {
  let component: ReturnfromworkshopComponent;
  let fixture: ComponentFixture<ReturnfromworkshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnfromworkshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnfromworkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

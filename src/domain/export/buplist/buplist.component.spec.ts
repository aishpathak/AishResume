import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuplistComponent } from './buplist.component';

describe('BuplistComponent', () => {
  let component: BuplistComponent;
  let fixture: ComponentFixture<BuplistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuplistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

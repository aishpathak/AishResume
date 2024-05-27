import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndeliveredshipmentComponent } from './undeliveredshipment.component';

describe('UndeliveredshipmentComponent', () => {
  let component: UndeliveredshipmentComponent;
  let fixture: ComponentFixture<UndeliveredshipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndeliveredshipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndeliveredshipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

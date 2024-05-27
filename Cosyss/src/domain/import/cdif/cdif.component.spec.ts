import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CDIFComponent } from './cdif.component';

describe('CDIFComponent', () => {
  let component: CDIFComponent;
  let fixture: ComponentFixture<CDIFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CDIFComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CDIFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


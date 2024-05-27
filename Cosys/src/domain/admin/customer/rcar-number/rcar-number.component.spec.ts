import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcarNumberComponent } from './rcar-number.component';

describe('RcarNumberComponent', () => {
  let component: RcarNumberComponent;
  let fixture: ComponentFixture<RcarNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcarNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcarNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

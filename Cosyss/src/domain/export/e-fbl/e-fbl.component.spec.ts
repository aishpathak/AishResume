import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EFBLComponent } from './e-fbl.component';

describe('EFBLComponent', () => {
  let component: EFBLComponent;
  let fixture: ComponentFixture<EFBLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EFBLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EFBLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

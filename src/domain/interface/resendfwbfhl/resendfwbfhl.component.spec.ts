import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendfwbfhlComponent } from './resendfwbfhl.component';

describe('ResendfwbfhlComponent', () => {
  let component: ResendfwbfhlComponent;
  let fixture: ComponentFixture<ResendfwbfhlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendfwbfhlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendfwbfhlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

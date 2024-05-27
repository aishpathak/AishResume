import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EccexportshipmentComponent } from './eccexportshipment.component';

describe('EccexportshipmentComponent', () => {
  let component: EccexportshipmentComponent;
  let fixture: ComponentFixture<EccexportshipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EccexportshipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EccexportshipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

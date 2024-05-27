import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdiInterfaceSetUpComponent } from './edi-interface-set-up.component';

describe('EdiInterfaceSetUpComponent', () => {
  let component: EdiInterfaceSetUpComponent;
  let fixture: ComponentFixture<EdiInterfaceSetUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdiInterfaceSetUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdiInterfaceSetUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

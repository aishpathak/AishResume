import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbInformationComponent } from './awb-information.component';

describe('AwbInformationComponent', () => {
  let component: AwbInformationComponent;
  let fixture: ComponentFixture<AwbInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwbInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

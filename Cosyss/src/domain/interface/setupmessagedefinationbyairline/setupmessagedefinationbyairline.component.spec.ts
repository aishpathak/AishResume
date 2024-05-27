import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupmessagedefinationbyairlineComponent } from './setupmessagedefinationbyairline.component';

describe('SetupmessagedefinationbyairlineComponent', () => {
  let component: SetupmessagedefinationbyairlineComponent;
  let fixture: ComponentFixture<SetupmessagedefinationbyairlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupmessagedefinationbyairlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupmessagedefinationbyairlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

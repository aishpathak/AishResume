import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdiMessageEventSetupComponent } from './edi-message-event-setup.component';

describe('EdiMessageEventSetupComponent', () => {
  let component: EdiMessageEventSetupComponent;
  let fixture: ComponentFixture<EdiMessageEventSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdiMessageEventSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdiMessageEventSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EawbsetupComponent } from './eawbsetup.component';

describe('EawbsetupComponent', () => {
  let component: EawbsetupComponent;
  let fixture: ComponentFixture<EawbsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EawbsetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EawbsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterspageComponent } from './masterspage.component';

describe('MasterspageComponent', () => {
  let component: MasterspageComponent;
  let fixture: ComponentFixture<MasterspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

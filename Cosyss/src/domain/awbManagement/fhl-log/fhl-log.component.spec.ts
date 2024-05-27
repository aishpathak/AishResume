import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhlLogComponent } from './fhl-log.component';

describe('FhlLogComponent', () => {
  let component: FhlLogComponent;
  let fixture: ComponentFixture<FhlLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhlLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhlLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialenroutementComponent } from './specialenroutement.component';

describe('SpecialenroutementComponent', () => {
  let component: SpecialenroutementComponent;
  let fixture: ComponentFixture<SpecialenroutementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialenroutementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialenroutementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationconfigurationComponent } from './locationconfiguration.component';

describe('LocationconfigurationComponent', () => {
  let component: LocationconfigurationComponent;
  let fixture: ComponentFixture<LocationconfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationconfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

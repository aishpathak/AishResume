import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldflightoutComponent } from './uldflightout.component';

describe('UldflightoutComponent', () => {
  let component: UldflightoutComponent;
  let fixture: ComponentFixture<UldflightoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldflightoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldflightoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeShareFlightComponent } from './codeShareFlight.component';

describe('CodeShareFlightComponent', () => {
  let component: CodeShareFlightComponent;
  let fixture: ComponentFixture<CodeShareFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeShareFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeShareFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

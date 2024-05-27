import { UldFlightInComponent } from './uldflightin.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('UldFlightInComponent', () => {
  let component: UldFlightInComponent;
  let fixture: ComponentFixture<UldFlightInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldFlightInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldFlightInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoDocumentAcceptanceComponent } from './cargo-document-acceptance.component';

describe('CargoDocumentAcceptanceComponent', () => {
  let component: CargoDocumentAcceptanceComponent;
  let fixture: ComponentFixture<CargoDocumentAcceptanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoDocumentAcceptanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoDocumentAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

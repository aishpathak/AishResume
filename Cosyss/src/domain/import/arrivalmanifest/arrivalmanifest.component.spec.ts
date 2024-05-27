import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalmanifestComponent } from './arrivalmanifest.component';

describe('ArrivalmanifestComponent', () => {
  let component: ArrivalmanifestComponent;
  let fixture: ComponentFixture<ArrivalmanifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrivalmanifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivalmanifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

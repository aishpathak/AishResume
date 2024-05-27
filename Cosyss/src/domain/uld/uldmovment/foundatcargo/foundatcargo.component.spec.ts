import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundatcargoComponent } from './foundatcargo.component';

describe('FoundatcargoComponent', () => {
  let component: FoundatcargoComponent;
  let fixture: ComponentFixture<FoundatcargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundatcargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundatcargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

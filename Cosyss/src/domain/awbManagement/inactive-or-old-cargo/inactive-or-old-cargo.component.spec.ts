import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveOrOldCargoComponent } from './inactive-or-old-cargo.component';

describe('InactiveOrOldCargoComponent', () => {
  let component: InactiveOrOldCargoComponent;
  let fixture: ComponentFixture<InactiveOrOldCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveOrOldCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveOrOldCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundatapronComponent } from './foundatapron.component';

describe('FoundatapronComponent', () => {
  let component: FoundatapronComponent;
  let fixture: ComponentFixture<FoundatapronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundatapronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundatapronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

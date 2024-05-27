import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SighteduldsComponent } from './sightedulds.component';

describe('SighteduldsComponent', () => {
  let component: SighteduldsComponent;
  let fixture: ComponentFixture<SighteduldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SighteduldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SighteduldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

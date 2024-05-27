import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatearrivalmanifestComponent } from './createarrivalmanifest.component';

describe('CreatearrivalmanifestComponent', () => {
  let component: CreatearrivalmanifestComponent;
  let fixture: ComponentFixture<CreatearrivalmanifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatearrivalmanifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatearrivalmanifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

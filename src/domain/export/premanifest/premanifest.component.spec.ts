import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremanifestComponent } from './premanifest.component';

describe('PremanifestComponent', () => {
  let component: PremanifestComponent;
  let fixture: ComponentFixture<PremanifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PremanifestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremanifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

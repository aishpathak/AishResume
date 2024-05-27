import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatenamepopupComponent } from './duplicatenamepopup.component';

describe('DuplicatenamepopupComponent', () => {
  let component: DuplicatenamepopupComponent;
  let fixture: ComponentFixture<DuplicatenamepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DuplicatenamepopupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatenamepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

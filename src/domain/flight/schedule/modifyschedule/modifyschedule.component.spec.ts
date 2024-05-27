import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyscheduleComponent } from './modifyschedule.component';

describe('ModifyscheduleComponent', () => {
  let component: ModifyscheduleComponent;
  let fixture: ComponentFixture<ModifyscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresortingComponent } from './presorting.component';

describe('PresortingComponent', () => {
  let component: PresortingComponent;
  let fixture: ComponentFixture<PresortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

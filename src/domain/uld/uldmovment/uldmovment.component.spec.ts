import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldMovmentComponent } from './uldmovment.component';

describe('UldMovmentComponent', () => {
  let component: UldMovmentComponent;
  let fixture: ComponentFixture<UldMovmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldMovmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldMovmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageParameterComponent } from './page-parameter.component';

describe('PageParameterComponent', () => {
  let component: PageParameterComponent;
  let fixture: ComponentFixture<PageParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

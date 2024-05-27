import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDockTemplateComponent } from './truck-dock-template.component';

describe('TruckDockTemplateComponent', () => {
  let component: TruckDockTemplateComponent;
  let fixture: ComponentFixture<TruckDockTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckDockTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckDockTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

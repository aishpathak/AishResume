import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocDockUpdateComponent } from './adhoc-dock-update.component';

describe('AdhocDockUpdateComponent', () => {
  let component: AdhocDockUpdateComponent;
  let fixture: ComponentFixture<AdhocDockUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdhocDockUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdhocDockUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

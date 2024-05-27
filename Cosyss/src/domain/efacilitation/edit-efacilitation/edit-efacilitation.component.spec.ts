import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEfacilitationComponent } from './edit-efacilitation.component';

describe('EditEfacilitationComponent', () => {
  let component: EditEfacilitationComponent;
  let fixture: ComponentFixture<EditEfacilitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEfacilitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEfacilitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

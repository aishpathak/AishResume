import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListscawbComponent } from './listscawb.component';

describe('ListscawbComponent', () => {
  let component: ListscawbComponent;
  let fixture: ComponentFixture<ListscawbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListscawbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListscawbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

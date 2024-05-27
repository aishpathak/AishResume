import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFightDashboardComponent } from './details-fight-dashboard.component';

describe('DetailsFightDashboardComponent', () => {
  let component: DetailsFightDashboardComponent;
  let fixture: ComponentFixture<DetailsFightDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsFightDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFightDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

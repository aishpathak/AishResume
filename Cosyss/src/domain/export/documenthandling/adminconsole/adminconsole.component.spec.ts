import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminconsoleComponent } from './adminconsole.component';

describe('AdminconsoleComponent', () => {
  let component: AdminconsoleComponent;
  let fixture: ComponentFixture<AdminconsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminconsoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminconsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

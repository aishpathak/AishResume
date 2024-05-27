import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargodamagereportlistComponent } from './cargodamagereportlist.component';

describe('CargodamagereportlistComponent', () => {
  let component: CargodamagereportlistComponent;
  let fixture: ComponentFixture<CargodamagereportlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargodamagereportlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargodamagereportlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

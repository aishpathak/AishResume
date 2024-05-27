import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempLogComponent } from './temp-log.component';

describe('TempLogComponent', () => {
  let component: TempLogComponent;
  let fixture: ComponentFixture<TempLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

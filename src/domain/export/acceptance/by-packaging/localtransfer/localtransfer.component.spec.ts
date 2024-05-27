import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaltransferComponent } from './localtransfer.component';

describe('LocaltransferComponent', () => {
  let component: LocaltransferComponent;
  let fixture: ComponentFixture<LocaltransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocaltransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocaltransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

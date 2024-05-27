import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UldrepairComponent } from './uldrepair.component';

describe('UldrepairComponent', () => {
  let component: UldrepairComponent;
  let fixture: ComponentFixture<UldrepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UldrepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UldrepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

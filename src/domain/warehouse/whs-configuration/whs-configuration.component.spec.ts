import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhsConfigurationComponent } from './whs-configuration.component';

describe('WhsConfigurationComponent', () => {
  let component: WhsConfigurationComponent;
  let fixture: ComponentFixture<WhsConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhsConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

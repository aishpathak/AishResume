import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAwbnotificationComponent } from './import-awbnotification.component';

describe('ImportAwbnotificationComponent', () => {
  let component: ImportAwbnotificationComponent;
  let fixture: ComponentFixture<ImportAwbnotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAwbnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAwbnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

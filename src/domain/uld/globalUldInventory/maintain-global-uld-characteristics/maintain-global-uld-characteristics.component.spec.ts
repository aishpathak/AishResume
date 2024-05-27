import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainGlobalUldCharacteristicsComponent } from './maintain-global-uld-characteristics.component';

describe('MaintainGlobalUldCharacteristicsComponent', () => {
  let component: MaintainGlobalUldCharacteristicsComponent;
  let fixture: ComponentFixture<MaintainGlobalUldCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainGlobalUldCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainGlobalUldCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

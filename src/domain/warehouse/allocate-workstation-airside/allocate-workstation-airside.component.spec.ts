import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateWorkstationAirsideComponent } from './allocate-workstation-airside.component';

describe('AllocateWorkstationAirsideComponent', () => {
  let component: AllocateWorkstationAirsideComponent;
  let fixture: ComponentFixture<AllocateWorkstationAirsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateWorkstationAirsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateWorkstationAirsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainmrclpredeclarationComponent } from './maintainmrclpredeclaration.component';

describe('MaintainmrclpredeclarationComponent', () => {
  let component: MaintainmrclpredeclarationComponent;
  let fixture: ComponentFixture<MaintainmrclpredeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainmrclpredeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainmrclpredeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

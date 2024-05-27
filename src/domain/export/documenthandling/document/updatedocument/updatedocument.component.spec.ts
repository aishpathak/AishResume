import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedocumentComponent } from './updatedocument.component';

describe('UpdatedocumentComponent', () => {
  let component: UpdatedocumentComponent;
  let fixture: ComponentFixture<UpdatedocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMessageHandlingDefinitionComponent } from './add-new-message-handling-definition.component';

describe('AddNewMessageHandlingDefinitionComponent', () => {
  let component: AddNewMessageHandlingDefinitionComponent;
  let fixture: ComponentFixture<AddNewMessageHandlingDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewMessageHandlingDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMessageHandlingDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

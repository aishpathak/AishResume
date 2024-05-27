import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupedMessageHandlingDefinitionComponent } from './edit-grouped-message-handling-definition.component';

describe('EditGroupedMessageHandlingDefinitionComponent', () => {
  let component: EditGroupedMessageHandlingDefinitionComponent;
  let fixture: ComponentFixture<EditGroupedMessageHandlingDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupedMessageHandlingDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupedMessageHandlingDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

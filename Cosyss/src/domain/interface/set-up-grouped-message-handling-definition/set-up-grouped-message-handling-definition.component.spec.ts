import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpGroupedMessageHandlingDefinitionComponent } from './set-up-grouped-message-handling-definition.component';

describe('SetUpGroupedMessageHandlingDefinitionComponent', () => {
  let component: SetUpGroupedMessageHandlingDefinitionComponent;
  let fixture: ComponentFixture<SetUpGroupedMessageHandlingDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetUpGroupedMessageHandlingDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpGroupedMessageHandlingDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceHandlingDefinitionComponent } from './acceptance-handling-definition.component';

describe('AcceptanceHandlingDefinitionComponent', () => {
  let component: AcceptanceHandlingDefinitionComponent;
  let fixture: ComponentFixture<AcceptanceHandlingDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptanceHandlingDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceHandlingDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

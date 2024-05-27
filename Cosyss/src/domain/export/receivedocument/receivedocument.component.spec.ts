import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedocumentComponent } from './receivedocument.component';

describe('ReceivedocumentComponent', () => {
  let component: ReceivedocumentComponent;
  let fixture: ComponentFixture<ReceivedocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundLyingListComponent } from './outbound-lying-list.component';

describe('OutboundLyingListComponent', () => {
  let component: OutboundLyingListComponent;
  let fixture: ComponentFixture<OutboundLyingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundLyingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundLyingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

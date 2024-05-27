import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlacklistairwaybillComponent } from "./blacklistairwaybill.component";

describe("BlacklistairwaybillComponent", () => {
  let component: BlacklistairwaybillComponent;
  let fixture: ComponentFixture<BlacklistairwaybillComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [BlacklistairwaybillComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistairwaybillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

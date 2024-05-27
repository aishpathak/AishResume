import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AirlineplasticsheetsComponent } from "./airlineplasticsheets.component";

describe("AirlineplasticsheetsComponent", () => {
  let component: AirlineplasticsheetsComponent;
  let fixture: ComponentFixture<AirlineplasticsheetsComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AirlineplasticsheetsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineplasticsheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

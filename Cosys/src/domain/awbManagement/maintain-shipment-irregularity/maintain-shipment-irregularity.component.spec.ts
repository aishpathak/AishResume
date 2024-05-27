import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MaintainShipmentIrregularityComponent } from "./maintain-shipment-irregularity.component";

describe("MaintainShipmentIrregularityComponent", () => {
  let component: MaintainShipmentIrregularityComponent;
  let fixture: ComponentFixture<MaintainShipmentIrregularityComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MaintainShipmentIrregularityComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainShipmentIrregularityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});

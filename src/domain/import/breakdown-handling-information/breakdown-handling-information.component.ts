import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef } from "@angular/core";
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
// NGC framework imports
import { NgcUtility, NgcButtonComponent, NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration } from "ngc-framework";
import { HouseModel, SHCModel } from "../../import/import.sharedmodel";
import { ImportService } from "../import.service";
import { BreakdownHandlingDataSaveRequest, BreakDownHandlingInstructionShipmentModel, BreakDownHandlingRequest } from "./../import.sharedmodel";


@Component({
  selector: "app-breakdown-handling-information",
  templateUrl: "./breakdown-handling-information.component.html",
  styleUrls: ["./breakdown-handling-information.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class BreakdownHandlingInformationComponent extends NgcPage {
  item: any;
  response: any;
  displayData: any;
  shipmentNumberParameter: any;
  breakdownHandlingList: any[] = [];
  isBreakdoenInformation: boolean = false;
  shcList: any[] = [];
  houseList: any[] = [];
  disabledtrue: boolean = false;
  @ViewChild("window")
  window: NgcWindowComponent;
  @ViewChild("windowAdd")
  windowAdd: NgcWindowComponent;
  @ViewChild("deleteButton")
  deleteButton: NgcButtonComponent;
  @ViewChild("saveButton")
  saveButton: NgcButtonComponent;
  @ViewChild("searchButton")
  searchButton: NgcButtonComponent;
  @ViewChild("goTo")
  goTo: any;
  shipmentNumber: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }
  breakDownHandling: any[] = [];

  private breakdownHandlingForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightId: new NgcFormControl(),
    accountRegistration: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    sta: new NgcFormControl(),
    eta: new NgcFormControl(),
    ata: new NgcFormControl(),
    segment: new NgcFormControl(),
    breakDownHandlingInformation: new NgcFormArray([
      new NgcFormGroup({
        tenantId: new NgcFormControl()
      })
    ])
  });

  selectedArray: any;
  flightId: any;

  ngOnInit() {
    super.ngOnInit();
  }
  onBack() {
    this.navigateBack(this.breakdownHandlingForm.getRawValue());
  }

  onHawtadd(index) {
    console.log("on link");
  }

  public onSearch(): void {
    let request = new BreakDownHandlingRequest();

    request.flightKey = this.breakdownHandlingForm.get("flightKey").value;
    request.flightOriginDate = this.breakdownHandlingForm.get("flightOriginDate").value;

    if (request.flightKey == null || request.flightOriginDate == null) {
      this.showErrorStatus("error.import.enter.mandatory.fields");
      return;
    }

    this.importService.getbreakDownList(request).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList) {
        this.displayData = false;
        this.isBreakdoenInformation = false;
        this.breakdownHandlingForm.get('breakDownHandlingInformation').reset();
      }
      if (data.data[0]) {
        this.disabledtrue = false;
        this.displayData = true;
        this.isBreakdoenInformation = true;
        this.breakdownHandlingForm.get("flightOriginDate").setValue(request.flightOriginDate);
        data.data[0].flightKey = this.breakdownHandlingForm.get("flightKey").value;
        data.data[0].flightOriginDate = this.breakdownHandlingForm.get("flightOriginDate").value;
        this.breakdownHandlingForm.get("accountRegistration").setValue(data.data[0].accountRegistration);
        data.data[0].breakDownHandlingInformation.forEach(element => {
          element["selectCheckBox"] = false;
        });
        this.shipmentNumberParameter = this.createSourceParameter(
          this.breakdownHandlingForm.get("flightKey").value,
          this.breakdownHandlingForm.get("flightOriginDate").value
        );
        this.breakdownHandlingForm.get("breakDownHandlingInformation").patchValue(data.data[0].breakDownHandlingInformation);
        this.breakdownHandlingForm.patchValue(data.data[0]);

        /**
         * Validation For HAWB, instruction & Breakdown Instruction
         * 1. If HAWB Presents Then Instruction Is Optional
         * 2. If HAWB Presents Then Breakdown Instruction Is Mandatory
         * 3. If HAWB is empty then instruction should be mandatory
         */
        (this.breakdownHandlingForm.get("breakDownHandlingInformation") as NgcFormArray).controls.forEach((record => {
          if ((record.get('houseNumberList') as NgcFormArray).length > 0) {
            record.get('instruction').clearValidators();
          } else {
            record.get('instruction').setValidators([Validators.required]);
          }
          (record.get('houseNumberList') as NgcFormArray).controls.forEach(hawbDetails => {
            if (hawbDetails.get('houseNumber').value !== null) {
              hawbDetails.get('breakdownInstruction').setValidators([Validators.required]);
              hawbDetails.get('houseNumber').setValidators([Validators.required]);
            } else {
              hawbDetails.get('breakdownInstruction').clearValidators();
              hawbDetails.get('houseNumber').clearValidators();
            }
          })
        }));

      } else {
        this.isBreakdoenInformation = false;
        this.displayData = false;
        this.showErrorStatus("no.record.found");
        return;
      }
    });
  }

  addAWB() {
    this.isBreakdoenInformation = true;
    console.log("add AWB");
    const noOfRows = (<NgcFormArray>(this.breakdownHandlingForm.get("breakDownHandlingInformation"))).length;
    const lastRow = noOfRows ? (<NgcFormArray>(this.breakdownHandlingForm.get("breakDownHandlingInformation"))).controls[noOfRows - 1] : null;

    if (!lastRow || lastRow.get("flightId").value) {
      (<NgcFormArray>(this.breakdownHandlingForm.get("breakDownHandlingInformation"))).addValue([{
        selectCheckBox: false,
        flightId: this.breakdownHandlingForm.get("flightId").value,
        shipmentNumber: "",
        hawbNumber: "",
        houseNumberList: [
          {
            houseNumber: null,
            breakdownInstruction: null
          }
        ],
        origin: "",
        destination: "",
        pieces: "",
        instruction: "",
        natureOfGoodsDescription: "",
        weight: "",
        shc: "",
        flagCRUD: "C"
      }
      ]);

      if (this.breakdownHandlingForm.get(['breakDownHandlingInformation', 0, 'instruction']).value !== null && this.breakdownHandlingForm.get(['breakDownHandlingInformation', 0, 'instruction']).value !== '') {
        (<NgcFormArray>(this.breakdownHandlingForm.get(['breakDownHandlingInformation', noOfRows, 'instruction']))).clearValidators();
      } else {
        (<NgcFormArray>(this.breakdownHandlingForm.get(['breakDownHandlingInformation', noOfRows, 'instruction']))).setValidators([Validators.required]);
      }
      console.log(this.breakdownHandlingForm.getRawValue());
    }
  }

  onDelete(INDEX: number) {
    this.isBreakdoenInformation = true;
    var a = this.breakdownHandlingForm.get("breakDownHandlingInformation").value;
    this.selectedArray = [];
    this.flightId = this.breakdownHandlingForm.get("flightKey").value;
    let select: any = this.breakdownHandlingForm.get("breakDownHandlingInformation").value;
    let index = 0;
    //console.log("select", select);
    const selected = select[INDEX];
    selected.flightId = this.flightId;
    this.selectedArray.push(selected);
    select.forEach(a => { });
    const breakdownHandlingDataSaveRequest = new BreakdownHandlingDataSaveRequest();
    this.breakdownHandlingList = [];

    this.selectedArray.forEach(element => {
      const breakdownHandlingData = new BreakDownHandlingInstructionShipmentModel();

      breakdownHandlingData.breakdownId = element.breakdownId;
      breakdownHandlingData.shipmentNumber = element.shipmentNumber
      this.breakdownHandlingList.push(breakdownHandlingData);
    });
    breakdownHandlingDataSaveRequest.shipments = this.breakdownHandlingList;
    this.importService.deleteBreakdownHandling(breakdownHandlingDataSaveRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList === null) {
        this.showSuccessStatus("g.completed.successfully");
      }
    });
    this.onSearch();
  }

  saveBreakDownHandling() {

    this.breakdownHandlingForm.validate();
    if (this.breakdownHandlingForm.invalid) {
      return;
    } else {
      this.isBreakdoenInformation = true;
      var a = this.breakdownHandlingForm.get("breakDownHandlingInformation").value;
      this.selectedArray = [];
      this.flightId = this.breakdownHandlingForm.get("flightId").value;
      let select: any = this.breakdownHandlingForm.get("breakDownHandlingInformation").value;
      let index = 0;

      select.forEach(a => {
        console.log("Inside if", a["selectCheckBox"]);
        a.flightId = this.flightId;
        this.selectedArray.push(a);
      });
      console.log("Index Value", this.selectedArray);
      const breakdownHandlingDataSaveRequest = this.breakdownHandlingForm.getRawValue();
      this.breakdownHandlingList = [];


      for (let element of this.selectedArray) {
        let breakdownHandlingData = new BreakDownHandlingInstructionShipmentModel();
        breakdownHandlingData.flightId = element.flightId;
        breakdownHandlingData.origin = element.origin;
        breakdownHandlingData.flightKey = this.breakdownHandlingForm.get("flightKey").value;
        breakdownHandlingData.flightDate = this.breakdownHandlingForm.get("flightOriginDate").value;
        breakdownHandlingData.destination = element.destination;
        breakdownHandlingData.instruction = element.instruction;
        breakdownHandlingData.totalPieces = element.pieces;
        breakdownHandlingData.shipmentNumber = element.shipmentNumber;
        breakdownHandlingData.breakdownId = element.breakdownId;
        this.shcList = [];
        const shcmodel = new SHCModel();
        shcmodel.shipmentNumber = element.shipmentNumber;
        shcmodel.specialHandlingCode = element.shc;
        this.shcList.push(shcmodel);
        breakdownHandlingData.shcs = this.shcList;
        this.houseList = [];
        const housemodel = new HouseModel();
        housemodel.houseNumber = element.hawbNumber;
        this.houseList.push(housemodel);

        breakdownHandlingData.house = element.houseNumberList;
        if (NgcUtility.isTenantCityOrAirport(element.origin)) {
          this.showErrorStatus("error.import.origin.sin.shipment");
          return;
        } else {
          this.breakdownHandlingList.push(breakdownHandlingData);
        }
      }

      breakdownHandlingDataSaveRequest.shipments = this.breakdownHandlingList;
      console.log("on Saving");
      breakdownHandlingDataSaveRequest.breakDownHandlingInformation = null;
      this.importService.saveUpdateBreakdownHandling(breakdownHandlingDataSaveRequest).subscribe(data => {
        this.refreshFormMessages(data);
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
        }
      });
    }
  }

  onAddHAWBNumber(index) {
    (<NgcFormArray>(this.breakdownHandlingForm.get(["breakDownHandlingInformation", index, "houseNumberList"]))).addValue([{
      houseNumber: "",
      breakdownInstruction: ""
    }]);

  }
  onDeleteHAWBNumber(index, sindex) {
    (<NgcFormArray>(this.breakdownHandlingForm.get(["breakDownHandlingInformation", index, "houseNumberList"]))).deleteValueAt(sindex);

    if ((<NgcFormArray>(this.breakdownHandlingForm.get(["breakDownHandlingInformation", index, "houseNumberList"]))).value.length === 0) {
      (<NgcFormArray>(this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'instruction']))).setValidators([Validators.required]);
    }
  }

  onAddInstru(index) {
    (<NgcFormArray>(this.breakdownHandlingForm.get(["breakDownHandlingInformation", index, "instructionList"]))).addValue([{
      instruction: ""
    }]);
  }

  public onSelect(event, item, index) {
    item.get("origin").setValue(event.param1);
    item.get("destination").setValue(event.param2);
    item.get("pieces").setValue(event.param5);
    item.get("weight").setValue(event.param6);
    item.get("natureOfGoodsDescription").setValue(event.param4);
    item.get("shc").setValue(event.param7);
    this.shipmentNumber = item.get('shipmentNumber').value;
    this.importService.getHAWBInfo(this.shipmentNumber).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        //item.get(['houseNumberList', 'houseNumber']).setValue(response.data);
        for (let i = 0; i < response.data.length; i++) {
          this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', i, 'houseNumber']).patchValue(response.data[i])
          this.onAddHAWBNumber(index)
        }
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  public onChangeInstruction(data, index, sindex) {
    if (this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).value == null
      && this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).value != null) {
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).setValidators([Validators.maxLength(35)]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).setValidators([Validators.required]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).setValidators([Validators.maxLength(65)]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).setValidators([Validators.required]);
    }
    if (this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).value == null
      && this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).value == null) {
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).clearValidators();
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).clearValidators();
    }
    if (this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).value !== null) {
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).setValidators([Validators.maxLength(65)]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).setValidators([Validators.required]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).setValidators([Validators.maxLength(35)]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).setValidators([Validators.required]);
    }
  }

  public onChangeHAWB(data, index, sindex) {
    if (this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).value != null
      && this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).value == null) {
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).setValidators([Validators.maxLength(65)]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).setValidators([Validators.required]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).setValidators([Validators.maxLength(35)]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).setValidators([Validators.required]);
    }
    if (this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).value == null
      && this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).value == null) {
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).clearValidators();
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).clearValidators();
    }
    if (this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).value !== null) {
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).setValidators([Validators.maxLength(35)]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'houseNumber']).setValidators([Validators.required]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).setValidators([Validators.maxLength(65)]);
      this.breakdownHandlingForm.get(['breakDownHandlingInformation', index, 'houseNumberList', sindex, 'breakdownInstruction']).setValidators([Validators.required]);
    }
  }

}
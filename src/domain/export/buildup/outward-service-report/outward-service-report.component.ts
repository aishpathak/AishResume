import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  OnDestroy,
  ViewChild
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  PageConfiguration,
  NgcWindowComponent,
  NgcButtonComponent,
  NgcReportComponent,
  NgcUtility
} from "ngc-framework";
import { Router } from "@angular/router";
import { BuildupService } from "../buildup.service";
import { Environment } from "../../../../environments/environment";
import {
  OutwardServiceReportSearchRequest,
  OutwardServiceReportSearchResponse,
  OutwardServiceReportInsertRequest,
  FinalizeFlagDataOutwardServiceReport
} from "../buildup.sharedmodel";

@Component({
  selector: "app-outward-service-report",
  templateUrl: "./outward-service-report.component.html",
  styleUrls: ["./outward-service-report.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class OutwardServiceReportComponent extends NgcPage {
  @ViewChild("finalizebutton")
  finalizeButton: NgcButtonComponent;
  @ViewChild("unfinalizeButton")
  unfinalizeButton: NgcButtonComponent;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  documentFlag = false;
  freightFlag = false;
  reportParameters: any;
  offloadFlag = false;
  finalizeFlag = false;
  showDataFlag = false;
  duplicateFlag = false;
  finalFlag = true;
  flightCompleteFlag = false;

  newRowDataDescrepancies = [
    {
      shipmentNumber: "",
      hawb: "",
      origin: "",
      destination: "",
      pieces: 0,
      weight: 0,
      weightUnitCode: "K",
      natureOfGoods: "",
      cargoIrregularityCode: "",
      irregularityPieces: 0,
      irregularityRemarks: "",
      manualFlag: true,
      deleteFlag: true,
      remarks: null
    }
  ];

  newRowFreightDescrepancies = [
    {
      shipmentNumber: "",
      hawb: "",
      origin: "",
      destination: "",
      pieces: 0,
      weight: 0,
      weightUnitCode: "K",
      natureOfGoods: "",
      cargoIrregularityCode: "",
      irregularityPieces: 0,
      irregularityRemarks: "",
      manualFlag: true,
      deleteFlag: true,
      remarks: null
    }
  ];

  newRowOtherDiscrepancies = [
    {
      userId: this.getUserProfile().userLoginCode,
      remarks: "",
      manualFlag: true
    }
  ];

  responseData: OutwardServiceReportSearchResponse;

  private outwardServiceReportForm: NgcFormGroup = null;
  showStdTimeOnly: boolean;
  showEtdTimeOnly: boolean;
  dataAvailableFlag: boolean;
  showAtdTimeOnly: boolean;
  flightId: number;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router,
    private buildupService: BuildupService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.initialise();
  }

  initialise() {
    this.outwardServiceReportForm = new NgcFormGroup({
      flightKey: new NgcFormControl(),
      date: new NgcFormControl(),
      segment: new NgcFormControl(),
      std: new NgcFormControl(),
      etd: new NgcFormControl(),
      atd: new NgcFormControl(),
      manifest: new NgcFormControl(true),
      warehouse: new NgcFormControl(false),
      manifestLastUpdatedBy: new NgcFormControl(),
      warehouseLastUpdatedBy: new NgcFormControl(),
      manifestlastupdatedByDate: new NgcFormControl(),
      warehouselastupdatedByDate: new NgcFormControl(),
      outwardServiceReportFinalizedBy: new NgcFormControl(),
      manifestingOA: new NgcFormControl(),
      loadControlCO: new NgcFormControl(),
      exportWarehouseOA: new NgcFormControl(),
      cargoPreCheckedBy: new NgcFormControl(),
      exportWarehouseCO: new NgcFormControl(),
      documentDiscrepancies: new NgcFormArray([]),
      freightDiscrepancies: new NgcFormArray([]),
      offloadingDiscrepancies: new NgcFormArray([]),
      otherDiscrepancies: new NgcFormArray([]),
      damageReport: new NgcFormArray([]),
      warehouseNewDataFlag: new NgcFormControl()
    });
  }
  /**
   * On Destroy
   */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // this.documentFlag = true;
    // this.outwardServiceReportForm.get('manifestLastUpdatedBy').patchValue(Environment.applicationId);
    // this.outwardServiceReportForm.get('warehouseLastUpdatedBy').patchValue(Environment.applicationId);
  }

  /**
   * This function will be used to search
   * all discripencies related awb contained in  flight
   *
   * @memberof OutwardServiceReportComponent
   */

  search() {
    this.documentFlag = true;
    this.finalFlag = true;
    const searchReq = new OutwardServiceReportSearchRequest();
    searchReq.flightKey = this.outwardServiceReportForm.get("flightKey").value;
    searchReq.date = this.outwardServiceReportForm.get("date").value;
    this.buildupService
      .fetchOutwardServiceReport(searchReq)
      .subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.responseData = response.data;
          if (this.responseData !== null) {
            this.flightId = this.responseData.flightId;
            this.showDataFlag = true;
            //     this.outwardServiceReportForm.get('manifest').setValue(true);
            //    this.finalizeButton.disabled = true;
            this.finalizeFlag = this.responseData.finalize;
            this.flightCompleteFlag = this.responseData.flightComplete;
            if (this.finalizeFlag === null) {
              this.finalizeFlag = true;
            }

            if (this.finalizeFlag) {
              this.documentFlag = true;
              this.freightFlag = true;
            }

            if (this.responseData.expOutwardServiceReportId > 0) {
              this.finalFlag = false;
            }
          }
          if (this.responseData.documentDiscrepancies.length > 0) {
            let sno1 = 1;
            this.responseData.documentDiscrepancies.forEach(element => {
              element.sno = sno1;
              sno1 = sno1 + 1;
            });
          }

          if (this.responseData.freightDiscrepancies.length > 0) {
            let sno1 = 1;
            this.responseData.freightDiscrepancies.forEach(element => {
              element.sno = sno1;
              sno1 = sno1 + 1;
            });
          }

          if (this.responseData.offloadingDiscrepancies.length > 0) {
            let sno1 = 1;
            this.responseData.offloadingDiscrepancies.forEach(element => {
              element.sno = sno1;
              sno1 = sno1 + 1;
            });
          }

          if (this.responseData.otherDiscrepancies.length > 0) {
            let sno1 = 1;
            this.responseData.otherDiscrepancies.forEach(element => {
              element.sno = sno1;
              sno1 = sno1 + 1;
            });
          }
          this.outwardServiceReportForm.patchValue(this.responseData);
          this.setEtdStd();
          this.outwardServiceReportForm.get("manifest").patchValue(true);
        } else {
          this.outwardServiceReportForm.reset();
          this.initialise();
          this.outwardServiceReportForm
            .get("flightKey")
            .setValue(searchReq.flightKey);
          this.outwardServiceReportForm.get("date").setValue(searchReq.date);
          this.documentFlag = false;
          this.freightFlag = false;
          this.offloadFlag = false;
          this.finalizeFlag = false;
          this.showDataFlag = false;
          this.duplicateFlag = false;
          this.finalFlag = true;
          this.flightCompleteFlag = false;
        }
      });

  }
  /**
   * used to finalize the reporty
   *
   * @memberof OutwardServiceReportComponent
   */
  finalize() {
    const finalizeRequest = new FinalizeFlagDataOutwardServiceReport();
    finalizeRequest.expOutwardServiceReportId = this.responseData.expOutwardServiceReportId;
    finalizeRequest.flightKey = this.outwardServiceReportForm.get("flightKey").value;
    finalizeRequest.date = this.outwardServiceReportForm.get("date").value;
    finalizeRequest.flightId = this.responseData.flightId;
    finalizeRequest.finalize = !this.finalizeFlag;
    this.buildupService
      .setFinalizeFlagOutwardServiceReport(finalizeRequest)
      .subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          // this.responseData = response.data;
          this.showSuccessStatus("g.completed.successfully");
          this.search();
        }

      });
  }

  onClear() {
    this.outwardServiceReportForm.reset();
  }
  /**
   * This metho is used to add row
   * in document descrepencies
   *
   * @memberof OutwardServiceReportComponent
   */
  addDocumentDiscrepancies() {
    const noOfRows = (<NgcFormArray>(
      this.outwardServiceReportForm.get("documentDiscrepancies")
    )).length;
    if (noOfRows === 0) {
      this.newRowDataDescrepancies[0]["sno"] = noOfRows + 1;
    } else {
      this.newRowDataDescrepancies[0]["sno"] = noOfRows + 1;
    }

    (<NgcFormArray>(
      this.outwardServiceReportForm.get("documentDiscrepancies")
    )).addValue(this.newRowDataDescrepancies);

    (<NgcFormArray>(
      this.outwardServiceReportForm.get([
        "documentDiscrepancies",
        (<NgcFormArray>(
          this.outwardServiceReportForm.controls["documentDiscrepancies"]
        )).length - 1,
        "shipmentNumber"
      ])
    )).valueChanges.subscribe(changedValue => {
      if (changedValue !== null && changedValue !== "") {
        const requestForShipmentNumberDetails: any = {
          shipmentNumber: changedValue,
          discrepancyType: 'DOCUMENT',
          flightId: this.flightId
        };
        console.log(changedValue);

        this.checkShipmentNumberValuesDocument(requestForShipmentNumberDetails);
      }
    });
  }
  /**
   * Method used to add row
   * of freight descripency
   *
   * @memberof OutwardServiceReportComponent
   */
  addFreightDiscrepancies() {
    const noOfRows = (<NgcFormArray>(
      this.outwardServiceReportForm.get("freightDiscrepancies")
    )).length;

    if (noOfRows === 0) {
      this.newRowFreightDescrepancies[0]["sno"] = noOfRows + 1;
    } else {
      this.newRowFreightDescrepancies[0]["sno"] = noOfRows + 1;
    }

    (<NgcFormArray>(
      this.outwardServiceReportForm.get("freightDiscrepancies")
    )).addValue(this.newRowFreightDescrepancies);

    (<NgcFormArray>(
      this.outwardServiceReportForm.get([
        "freightDiscrepancies",
        (<NgcFormArray>(
          this.outwardServiceReportForm.controls["freightDiscrepancies"]
        )).length - 1,
        "shipmentNumber"
      ])
    )).valueChanges.subscribe(changedValue => {
      if (changedValue !== null && changedValue !== "") {
        const requestForShipmentNumberDetails: any = {
          shipmentNumber: changedValue,
          discrepancyType: 'FREIGHT',
          flightId: this.flightId
        };
        console.log(changedValue);
        this.checkShipmentNumberValues(requestForShipmentNumberDetails);

        // this.checkShipmentNumberRepeatFreight(
        //   changedValue,
        //   requestForShipmentNumberDetails
        // );
        // setTimeout(function () {
        //   if (repeat === true) {
        //     
        //   }
        // }, 100);
      }
    });
  }

  checkShipmentNumberRepeatFreight(
    value,
    requestForShipmentNumberDetails
  ): void {
    //  let count: number = 0;
    let val = new Array();
    val = this.outwardServiceReportForm
      .getRawValue()
      .freightDiscrepancies.filter(a => a.shipmentNumber === value);
    if (val) {
      this.showConfirmMessage(
        "export.same.number.do.you.want.to.continue"
      ).then(fulfilled => {
        this.checkShipmentNumberValues(requestForShipmentNumberDetails);
      });
    }


  }

  checkShipmentNumberValues(requestForShipmentNumberDetails): void {
    this.buildupService
      .fetchShipmentNumberValues(requestForShipmentNumberDetails)
      .subscribe(response => {
        this.refreshFormMessages(response);
        const data = response.data;
        const shipmentFormArray: NgcFormArray = <NgcFormArray>(
          this.outwardServiceReportForm.get("freightDiscrepancies")
        );

        if (shipmentFormArray) {
          const length = shipmentFormArray.length;
          if (data !== null) {
            if (
              shipmentFormArray.value[length - 1]["shipmentNumber"] ===
              requestForShipmentNumberDetails.shipmentNumber
            ) {
              delete data["shipmentNumber"];
              shipmentFormArray.controls[length - 1].patchValue(data);
            }
          }
        }
      });
  }

  checkShipmentNumberValuesDocument(requestForShipmentNumberDetails): void {
    this.buildupService
      .fetchShipmentNumberValues(requestForShipmentNumberDetails)
      .subscribe(response => {
        this.refreshFormMessages(response);
        const data = response.data;
        const shipmentFormArray: NgcFormArray = <NgcFormArray>(
          this.outwardServiceReportForm.get("documentDiscrepancies")
        );
        //
        if (shipmentFormArray) {
          const length = shipmentFormArray.length;
          if (data !== null) {
            if (
              shipmentFormArray.value[length - 1]["shipmentNumber"] ===
              requestForShipmentNumberDetails.shipmentNumber
            ) {
              delete data["shipmentNumber"];
              shipmentFormArray.controls[length - 1].patchValue(data);
            }
          }
        }
      });
  }
  //
  //  console.log(data);

  /**
   * Method used to add row
   * of freight descripency
   *
   * @memberof OutwardServiceReportComponent
   */
  addOtherDiscrepancies() {
    const noOfRows = (<NgcFormArray>(
      this.outwardServiceReportForm.get("otherDiscrepancies")
    )).length;
    if (noOfRows === 0) {
      this.newRowOtherDiscrepancies[0]["sno"] = noOfRows + 1;
    } else {
      this.newRowOtherDiscrepancies[0]["sno"] = noOfRows + 1;
    }
    (<NgcFormArray>(
      this.outwardServiceReportForm.get("otherDiscrepancies")
    )).addValue(this.newRowOtherDiscrepancies);
  }

  /**
   * Used to delete row from document descrepancies
   * manually added records
   *
   * @param {any} group
   * @memberof OutwardServiceReportComponent
   */
  deleteDocumentDescripencies(group) {
    const deleteRec = <NgcFormArray>(
      this.outwardServiceReportForm.controls["documentDiscrepancies"]
    );
    deleteRec.removeAt(group);
  }
  /**
   * Used to delete row from freight descrepancies
   * manually added records
   *
   * @param {any} group
   * @memberof OutwardServiceReportComponent
   */
  deleteFreightDiscrepencies(group) {
    const deleteRec = <NgcFormArray>(
      this.outwardServiceReportForm.controls["freightDiscrepancies"]
    );
    deleteRec.removeAt(group);
  }

  /**
   * Used to delete row from other descrepancies
   * manually added records
   *
   * @param {any} group
   * @memberof OutwardServiceReportComponent
   */
  deleteOtherDiscrepencies(group) {
    const deleteRec = <NgcFormArray>(
      this.outwardServiceReportForm.controls["otherDiscrepancies"]
    );
    deleteRec.removeAt(group);
  }

  /**
   * This method makes call to save events
   *
   * @param {any} event
   * @memberof OutwardServiceReportComponent
   */
  onSave(event) {
    if (this.outwardServiceReportForm.get("warehouse").value) {
      this.saveWarehouseRelatedInfo();
    }
    if (this.outwardServiceReportForm.get("manifest").value) {
      this.saveManifestRelatedInfo();
    }
  }

  saveWarehouseRelatedInfo() {
    const insertDescripancies = new OutwardServiceReportInsertRequest();
    if (this.outwardServiceReportForm.get("exportWarehouseOA").value === null || this.outwardServiceReportForm.get("exportWarehouseOA").value === '') {
      this.showErrorStatus("g.enter.mandatory.m");
      return;
    }
    if (this.outwardServiceReportForm.get("exportWarehouseCO").value === null || this.outwardServiceReportForm.get("exportWarehouseCO").value === '') {
      this.showErrorStatus("g.enter.mandatory.m");
      return;
    }
    insertDescripancies.flightKey = this.outwardServiceReportForm.get("flightKey").value;
    insertDescripancies.date = this.outwardServiceReportForm.get("date").value;
    insertDescripancies.warehouse = true;
    insertDescripancies.flightId = this.responseData.flightId;
    insertDescripancies.flightSegmentId = this.outwardServiceReportForm.get(
      "segment"
    ).value;
    insertDescripancies.manifestLastUpdatedBy = this.outwardServiceReportForm.get(
      "manifestLastUpdatedBy"
    ).value;
    insertDescripancies.warehouseLastUpdatedBy = this.outwardServiceReportForm.get(
      "warehouseLastUpdatedBy"
    ).value;
    insertDescripancies.manifestingOA = this.outwardServiceReportForm.get(
      "manifestingOA"
    ).value;
    insertDescripancies.loadControlCO = this.outwardServiceReportForm.get(
      "loadControlCO"
    ).value;
    insertDescripancies.exportWarehouseOA = this.outwardServiceReportForm.get(
      "exportWarehouseOA"
    ).value;
    insertDescripancies.cargoPreCheckedBy = this.outwardServiceReportForm.get(
      "cargoPreCheckedBy"
    ).value;
    insertDescripancies.exportWarehouseCO = this.outwardServiceReportForm.get(
      "exportWarehouseCO"
    ).value;
    if (this.responseData.documentDiscrepancies !== null) {
      insertDescripancies.documentDiscrepancies = this.responseData.documentDiscrepancies;
    }
    insertDescripancies.freightDiscrepancies = this.outwardServiceReportForm.get(
      "freightDiscrepancies"
    ).value;
    insertDescripancies.offloadingDiscrepancies = this.outwardServiceReportForm.get(
      "offloadingDiscrepancies"
    ).value;
    insertDescripancies.otherDiscrepancies = this.outwardServiceReportForm.get(
      "otherDiscrepancies"
    ).value;
    insertDescripancies.expOutwardServiceReportId = this.responseData.expOutwardServiceReportId;
    insertDescripancies.warehouseNewDataFlag = !this.dataAvailableFlag;

    //  this.checkDuplicateArrayValues(insertDescripancies.freightDiscrepancies);

    console.log(insertDescripancies);

    //  this.resetFormMessages();
    this.buildupService
      .insertOutwardServiceReportWarehouse(insertDescripancies)
      .subscribe(
        response => {

          if (!this.showResponseErrorMessages(response)) {
            this.showSuccessStatus("g.completed.successfully");
            this.search();
            //  this.outwardServiceReportForm.patchValue(response.data);
          }
        },
        error => {
          this.showErrorStatus(error);
        }
      );
  }

  saveManifestRelatedInfo() {
    let outwardServiceReport = this.outwardServiceReportForm.getRawValue();
    console.log("report", outwardServiceReport);
    if (this.outwardServiceReportForm.get("manifestingOA").value === null || this.outwardServiceReportForm.get("manifestingOA").value === '') {
      this.showErrorStatus("g.enter.mandatory.m");
      return;
    }
    if (this.outwardServiceReportForm.get("loadControlCO").value === null || this.outwardServiceReportForm.get("manifestingOA").value === '') {
      this.showErrorStatus("g.enter.mandatory.m");
      return;
    }
    const insertDescripancies = new OutwardServiceReportInsertRequest();
    insertDescripancies.flightKey = this.outwardServiceReportForm.get("flightKey").value;
    insertDescripancies.date = this.outwardServiceReportForm.get("date").value;
    insertDescripancies.flightId = this.responseData.flightId;
    insertDescripancies.manifest = true;
    insertDescripancies.flightSegmentId = this.outwardServiceReportForm.get(
      "segment"
    ).value;
    insertDescripancies.manifestLastUpdatedBy = this.outwardServiceReportForm.get(
      "manifestLastUpdatedBy"
    ).value;
    insertDescripancies.warehouseLastUpdatedBy = this.outwardServiceReportForm.get(
      "warehouseLastUpdatedBy"
    ).value;
    insertDescripancies.manifestingOA = this.outwardServiceReportForm.get(
      "manifestingOA"
    ).value;
    insertDescripancies.warehouseNewDataFlag = !this.dataAvailableFlag;
    insertDescripancies.loadControlCO = this.outwardServiceReportForm.get(
      "loadControlCO"
    ).value;
    insertDescripancies.exportWarehouseOA = this.outwardServiceReportForm.get(
      "exportWarehouseOA"
    ).value;
    insertDescripancies.cargoPreCheckedBy = this.outwardServiceReportForm.get(
      "cargoPreCheckedBy"
    ).value;
    insertDescripancies.exportWarehouseCO = this.outwardServiceReportForm.get(
      "exportWarehouseCO"
    ).value;
    insertDescripancies.documentDiscrepancies = this.outwardServiceReportForm.get(
      "documentDiscrepancies"
    ).value;

    if (this.responseData.freightDiscrepancies !== null) {
      insertDescripancies.freightDiscrepancies = this.responseData.freightDiscrepancies;
    }
    insertDescripancies.offloadingDiscrepancies = this.outwardServiceReportForm.get(
      "offloadingDiscrepancies"
    ).value;
    insertDescripancies.otherDiscrepancies = this.outwardServiceReportForm.get(
      "otherDiscrepancies"
    ).value;
    insertDescripancies.expOutwardServiceReportId = this.responseData.expOutwardServiceReportId;

    //  this.checkDuplicateArrayValues(insertDescripancies.documentDiscrepancies);


    this.resetFormMessages();
    this.buildupService
      .insertOutwardServiceReportManifest(insertDescripancies)
      .subscribe(
        response => {

          if (!this.showResponseErrorMessages(response)) {
            this.showSuccessStatus("g.completed.successfully");
            this.search();
          }
        },
        error => {
          this.showErrorStatus(error);
        }
      );
  }

  changeFlagsManifest() {
    if (!this.finalizeFlag) {
      this.documentFlag = true;
      this.freightFlag = false;
      this.offloadFlag = false;
    } else {
      this.documentFlag = true;
      this.freightFlag = true;
      this.offloadFlag = true;
    }
  }

  changeFlagsWarehouse() {
    if (!this.finalizeFlag) {
      this.freightFlag = true;
      this.offloadFlag = true;
      this.documentFlag = false;
    } else {
      this.freightFlag = true;
      this.offloadFlag = true;
      this.documentFlag = true;
    }
  }

  outwardReport() {
    const reportParameters: any = {};
    reportParameters.flightId = this.responseData.flightId;
    this.reportParameters = reportParameters;
    this.reportWindow.open();
  }
  /**
   *This function will route to capture damage screen
   *
   * @memberof OutwardServiceReportComponent
   */
  routeToCaptureDamage() {
    this.navigateTo(this.router, 'common/capturedamageDesktop', null);
  }

  setEtdStd(): any {
    let dateData = NgcUtility.getDateOnly(this.outwardServiceReportForm.get('date').value);
    if (this.outwardServiceReportForm.get('etd').value !== null) {
      let dateDataEtd = NgcUtility.getDateOnly(this.outwardServiceReportForm.get('etd').value);


      if (dateDataEtd.toDateString() === dateData.toDateString()) {
        this.showEtdTimeOnly = false;
      } else {
        this.showEtdTimeOnly = true;
      }
    }
    if (this.outwardServiceReportForm.get('std').value !== null) {
      let dateDateStd = NgcUtility.getDateOnly(this.outwardServiceReportForm.get('std').value);
      if (dateDateStd.toDateString() === dateData.toDateString()) {
        this.showStdTimeOnly = false;
      } else {
        this.showStdTimeOnly = true;
      }
    }

    if (this.outwardServiceReportForm.get('atd').value !== null) {
      let dateDateAtd = NgcUtility.getDateOnly(this.outwardServiceReportForm.get('atd').value);
      if (dateDateAtd.toDateString() === dateData.toDateString()) {
        this.showAtdTimeOnly = false;
      } else {
        this.showAtdTimeOnly = true;
      }
    }
  }

  onCancel() {
    this.navigateHome();
  }

}

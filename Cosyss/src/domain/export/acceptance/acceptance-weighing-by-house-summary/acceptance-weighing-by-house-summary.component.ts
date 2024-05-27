import { Component, OnInit, NgZone, ViewContainerRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgcPage, ReactiveModel, NgcFormGroup, PageConfiguration, NgcFormControl, NgcFormArray, NgcUtility, NgcWindowComponent, NgcReportComponent, NgcLOVComponent, ReportFormat } from 'ngc-framework';
import { AceptanceWeighingModel, AcceptanceWeighingSummarySearchModel, AcceptanceWeighingSummaryModel, AcceptanceWeighingSummaryHouseListModel, WeighingScaleRequest, WeighingScaleWeighingRequest, AcceptanceWeighingSummaryHouseDimesionModel, ShipmentExecModel, CreditDebitNote } from '../../export.sharedmodel';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportService } from '../../export.service';
import { CargoProcessingEngineService } from '../../../warehouse/cargoprocessingengine/cargoprocessingengine.service';
import { ViewChild } from "@angular/core";
import { Validators } from '@angular/forms';
import { interval, Subscription } from "rxjs";

@Component({
  selector: 'app-acceptance-weighing-by-house-summary',
  templateUrl: './acceptance-weighing-by-house-summary.component.html',
  styleUrls: ['./acceptance-weighing-by-house-summary.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class AcceptanceWeighingByHouseSummaryComponent extends NgcPage {
  reportParameters: any;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('declaredDimensionsWindow') declaredDimensionsWindow: NgcWindowComponent;
  @ViewChild('printCreditNoteWindow') printCreditNoteWindow: NgcWindowComponent;

  /*
  * Reactive Form
  */
  @ReactiveModel(AcceptanceWeighingSummarySearchModel)
  public searchFormGroup: NgcFormGroup;

  @ReactiveModel(AcceptanceWeighingSummaryModel)
  public summaryFormGroup: NgcFormGroup;

  @ReactiveModel(AcceptanceWeighingSummaryHouseListModel)
  public declaredDimensionsGroup: NgcFormGroup;

  displayFlag = false;

  returnCargoflag = false;
  transferData: any;
  actionlistindicator: any;

  tenantCountryCode = NgcUtility.getTenantConfiguration().countryCode;
  flightOffPointDropdownSourceParam: any;


  constructor(private router: Router, appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private exportService: ExportService, private _cargoEngineProcessService: CargoProcessingEngineService,
    private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  public ngOnInit(): void {

    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData != null && this.transferData !== undefined) {
      this.searchFormGroup.get('shipmentNumber').setValue(
        (this.transferData['shipmentNumber'] == null) ? '' : this.transferData['shipmentNumber']
      );
      this.searchFormGroup.get('acceptanceType').setValue("INT");
      this.onSearch();
    }
  }


  onSearch() {
    this.searchFormGroup.validate();
    if (!this.searchFormGroup.valid) {
      return;
    }
    else {
      this.summaryFormGroup.reset();
      this.displayFlag = false;
      let request: AcceptanceWeighingSummarySearchModel = this.searchFormGroup.getRawValue();
      this.exportService.searchAcceptanceSummary(request).subscribe(response => {
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            (<NgcFormArray>this.summaryFormGroup.get("houseSummaryList")).resetValue([]);

            //this.searchFormGroup.reset();
            this.displayFlag = true;
            this.summaryFormGroup.patchValue(response.data);
            if (this.summaryFormGroup.get('origin').value === null) {
              this.summaryFormGroup.get('origin').setValue(NgcUtility.getTenantConfiguration().airportCode);
            }
            this.flightOffPointDropdownSourceParam = this.createSourceParameter(this.summaryFormGroup.get('firstBookedFlight').value, NgcUtility.getDateTimeAsStringByFormat(this.summaryFormGroup.get('firstBookedFlightDate').value, 'YYYY-MM-DD')); //Updting Flight Off Point DropDown
            this.setUiValidatorsOnSearch();
          }
        }
      })
    }

  }

  private setUiValidatorsOnSearch() {
    this.onChangeManualBookingInfo(this.summaryFormGroup.get('manualBookingInfo').value);

    if (this.summaryFormGroup.get('showReturnSection').value || this.summaryFormGroup.get('returnRequested').value) {
      this.summaryFormGroup.get('returnReason').setValidators(Validators.required);
      this.onChangeReturnReason(this.summaryFormGroup.get('returnReason').value);
    } else {
      this.summaryFormGroup.get('returnReason').clearValidators();
      this.summaryFormGroup.get('returnRemarks').clearValidators();
      this.summaryFormGroup.get('tansferCTO').clearValidators();
      this.summaryFormGroup.get('newShipmentNumber').clearValidators();
    }
  }

  onAgentNameAutoFill(object, item) {
    this.summaryFormGroup.get('customerName').setValue(object.desc);
  }
  onHouseAgentNameAutoFill(object, index) {
    this.summaryFormGroup.get(["houseSummaryList", index]).get('customerShortName').setValue(object.desc);
    this.summaryFormGroup.get(["houseSummaryList", index]).get('customerCode').setValue(object.code);

  }

  finalizeWeight() {
    this.summaryFormGroup.validate();
    if (!this.summaryFormGroup.valid) {
      return;
    }
    else {
      let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
      this.exportService.finalizeWeight(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            if (response.data.acknowledgeIndicatorCPE) {
              this.showErrorStatus('export.acknowledge.and.close.all.actions');
              this.actionlistindicator = "error";

            } else if (response.data.billingErrorPlaceholder !== null) {
              this.showErrorMessage('exp.accpt.charges.pending', null, [response.data.billingErrorPlaceholder]);
            } else {
              this.showSuccessStatus("success.Status");
              this.actionlistindicator = "";
            }

            this.summaryFormGroup.patchValue(response.data);
            this.showSuccessStatus('uld.operation.completed.successfully');
          } else {
            if (response.data !== null) {
              this.summaryFormGroup.patchValue(response.data);
            }
          }
        }
      });
    }
  }

  reOpenfinalizeWeight() {
    let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
    this.exportService.reOpenfinalizeWeight(request).subscribe(response => {
      this.resetFormMessages();
      if (response !== null) {
        if (!this.showResponseErrorMessages(response)) {
          this.summaryFormGroup.patchValue(response.data);
          this.showSuccessStatus('uld.operation.completed.successfully');
        }
      }
    });
  }



  onWeighing() {
    let acceptanceWeighingSummaryHouseListModel: AcceptanceWeighingSummaryHouseListModel = this.summaryFormGroup.get('houseSummaryList').value.find(obj => obj.select);

    let acceptanceWeighingSummaryModel: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();

    //summaryFormGroup validation is needed as the form data is getting saved in the below startHouseWeighing API call
    this.summaryFormGroup.validate();
    if (!this.summaryFormGroup.valid) {
      return;
    }
    this.exportService.startHouseWeighing(acceptanceWeighingSummaryModel).subscribe(response => {
      this.resetFormMessages();
      if (response !== null) {
        if (!this.showResponseErrorMessages(response)) {
          this.summaryFormGroup.patchValue(response.data);
          this.processOnWeighing(acceptanceWeighingSummaryHouseListModel);
        }
      }
    });

  }

  //Function for Navigating to Acceptance Weighing Screen
  private processOnWeighing(acceptanceWeighingSummaryHouseListModel: AcceptanceWeighingSummaryHouseListModel) {
    const requestObject = {
      shipmentNumber: acceptanceWeighingSummaryHouseListModel.shipmentNumber,
      shipmentType: 'AWB',
      hawbNumber: acceptanceWeighingSummaryHouseListModel.houseNumber
    }
    this.navigateTo(this.router, 'export/acceptance/acceptanceweighing', requestObject);
  }



  onDomesticWeighing() {
    console.log(this.summaryFormGroup.get('shipmentNumber').value);

    const requestObject = {
      shipmentNumber: this.summaryFormGroup.get('shipmentNumber').value,
      shipmentType: 'AWB',
    }
    this.navigateTo(this.router, 'export/acceptance/acceptanceweighing', requestObject);
  }

  //Trigerring CARR message with Message Type 'F'
  retriggerCarr() {
    let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
    this.exportService.sendcargoarrivalreport(request).subscribe(response => {
      this.resetFormMessages();
      if (response !== null) {
        if (!this.showResponseErrorMessages(response)) {
          this.summaryFormGroup.patchValue(response.data);
          this.showSuccessStatus('uld.operation.completed.successfully');
        }
      }
    });
  }

  //Trigerring CARR message with Message Type 'A'
  retriggerCarrForAmendment() {
    let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
    this.exportService.sendCargoArrivalReportForAmendment(request).subscribe(response => {
      this.resetFormMessages();
      if (response !== null) {
        if (!this.showResponseErrorMessages(response)) {
          this.summaryFormGroup.patchValue(response.data);
          this.showSuccessStatus('uld.operation.completed.successfully');
        }
      }
    });
  }

  declareDimensions() {
    let houseSummaryList: Array<AcceptanceWeighingSummaryHouseListModel> = this.summaryFormGroup.get('houseSummaryList').value;
    let acceptanceWeighingSummaryHouseListModel: AcceptanceWeighingSummaryHouseListModel = houseSummaryList.find(obj => obj.select);
    this.declaredDimensionsGroup.patchValue(acceptanceWeighingSummaryHouseListModel);
    this.declaredDimensionsWindow.open();
  }

  onDeleteDeclaredDimension(index) {
    (<NgcFormArray>this.declaredDimensionsGroup.get(['declaredDimensions'])).markAsDeletedAt(index);
  }

  onAddDeclaredDimension() {
    const newRow: AcceptanceWeighingSummaryHouseDimesionModel = new AcceptanceWeighingSummaryHouseDimesionModel();
    newRow.volumeCode = 'MC';
    (<NgcFormArray>this.declaredDimensionsGroup.get(['declaredDimensions'])).addValue([newRow]);
  }

  onSaveDeclaredDimensions() {
    this.resetFormMessages();
    (<NgcFormArray>this.declaredDimensionsGroup.get('declaredDimensions')).validate();

    for (let i = 0; i < (<NgcFormArray>this.declaredDimensionsGroup.get('declaredDimensions')).length; i++) {
      //Setting measurementUnitCode value for each row as selected from dropdown
      (<NgcFormArray>this.declaredDimensionsGroup.get('declaredDimensions')).at(i).get('measurementUnitCode').setValue(this.declaredDimensionsGroup.get('measurementUnitCode').value);

      //Validating Undeleted Dimension Rows, if invalid save is not performed
      if (!((<NgcFormGroup>(<NgcFormArray>this.declaredDimensionsGroup.get('declaredDimensions')).at(i)).isSoftDeleted)) {
        if (!this.declaredDimensionsGroup.get('declaredDimensions').valid) {
          return;
        }
      }

    }

    const totalDimensionPieces = (<Array<AcceptanceWeighingSummaryHouseDimesionModel>>this.declaredDimensionsGroup.get('declaredDimensions').value).filter((obj) => obj.flagCRUD !== 'D').map(obj => obj.pieces).reduce((x, y) => x + y, 0);
    if (totalDimensionPieces > this.declaredDimensionsGroup.get('declaredPieces').value) {
      this.showErrorMessage('export.accpt.totaldimensionpieces.invalid'); //Total Dimension Pieces cannot be greater than SB Pieces
      return;
    }


    let request: AcceptanceWeighingSummaryHouseListModel = this.declaredDimensionsGroup.getRawValue();
    request.acceptanceType = this.summaryFormGroup.get('acceptanceType').value;
    this.exportService.saveDeclaredDimensions(request).subscribe(response => {
      this.resetFormMessages();
      if (response !== null) {
        if (!this.showResponseErrorMessages(response)) {

          //Patching only House Model
          (<NgcFormArray>this.summaryFormGroup.get('houseSummaryList')).controls
            .find(x => x.value.houseInformationId === response.data.houseInformationId)
            .patchValue(response.data);


          //Patching only finalChargeableWeight  
          //this.summaryFormGroup.get('finalChargeableWeight').patchValue(response.data.shipmentChargeableWeight);

          this.declaredDimensionsWindow.close();
          this.showSuccessStatus('uld.operation.completed.successfully');
        }
      }
    });
  }

  onReturnHouse(index, warningMsg) {
    this.showConfirmMessage(warningMsg).then(fulfilled => {

      let acceptanceWeighingSummaryHouseListModel: AcceptanceWeighingSummaryHouseListModel = (<NgcFormGroup>this.summaryFormGroup.get(["houseSummaryList", index])).getRawValue();
      if (acceptanceWeighingSummaryHouseListModel.houseInformationId != null) {
        this.processOnReturnHouse(acceptanceWeighingSummaryHouseListModel);
      }
      else {
        this.summaryFormGroup.validate();
        if (!this.summaryFormGroup.valid) {
          return;
        }
        else {
          let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
          this.exportService.saveAcceptanceSummary(request).subscribe(response => {
            this.resetFormMessages();
            if (response !== null) {
              if (!this.showResponseErrorMessages(response)) {
                this.summaryFormGroup.patchValue(response.data);
                this.processOnReturnHouse(acceptanceWeighingSummaryHouseListModel);
              }
            }
          });
        }
      }
    });
  }


  private processOnReturnHouse(request: AcceptanceWeighingSummaryHouseListModel) {
    this.exportService.cancelHouse(request).subscribe(response => {
      this.resetFormMessages();
      if (response !== null) {
        if (!this.showResponseErrorMessages(response)) {
          this.summaryFormGroup.patchValue(response.data);

          let creditDebitNoteList: Array<CreditDebitNote> = (<Array<CreditDebitNote>>this.summaryFormGroup.get('creditDebitNoteList').value);

          if (creditDebitNoteList.length == 1) {
            this.onPrintCreditNote(creditDebitNoteList[0]);
          } else if ((<Array<String>>this.summaryFormGroup.get('creditDebitNoteList').value).length > 1) {
            this.printCreditNoteWindow.open();
          }
        }
      }
    });
  }

  onCancelReturnHouse(index) {
    let acceptanceWeighingSummaryHouseListModel: AcceptanceWeighingSummaryHouseListModel = (<NgcFormGroup>this.summaryFormGroup.get(["houseSummaryList", index])).getRawValue();

    this.exportService.cancelReturnHouse(acceptanceWeighingSummaryHouseListModel).subscribe(response => {
      this.resetFormMessages();
      if (response !== null) {
        if (!this.showResponseErrorMessages(response)) {
          this.summaryFormGroup.patchValue(response.data);
          this.showSuccessStatus('uld.operation.completed.successfully');
        }
      }
    });
  }

  onEnquireHouseCharges() {
    let acceptanceWeighingSummaryHouseListModel: AcceptanceWeighingSummaryHouseListModel = this.summaryFormGroup.get('houseSummaryList').value.find(obj => obj.select);
    const requestObject = {
      shipmentNumber: this.summaryFormGroup.get('shipmentNumber').value,
      hawbNumber: acceptanceWeighingSummaryHouseListModel.houseNumber,
      shipmentHouseId: acceptanceWeighingSummaryHouseListModel.shipmentHouseId,
      shipment: this.summaryFormGroup.get('shipmentNumber').value,
      returnAWBSummary: true,
      acceptanceType: this.summaryFormGroup.get('acceptanceType').value,
      shipmentType: 'AWB'
    };
    this.navigateTo(this.router, 'billing/collectPayment/enquireCharges', requestObject);
  }


  // rejectSB() {
  //   let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
  //   this.exportService.rejectHouse(request).subscribe(response => {
  //     this.resetFormMessages();
  //     if (response !== null) {
  //       if (!this.showResponseErrorMessages(response)) {
  //         this.summaryFormGroup.patchValue(response.data);
  //         this.showSuccessStatus('uld.operation.completed.successfully');
  //       }
  //     }
  //   });
  // }

  onReturnCargo() {
    this.summaryFormGroup.get('returnReason').setValidators(Validators.required);
    this.summaryFormGroup.get('showReturnSection').setValue(true);
  }



  returnCargo() {
    this.showConfirmMessage('Do you want to Return the Complete Shipment').then(fulfilled => {

      let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
      this.exportService.returnCargo(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.summaryFormGroup.patchValue(response.data);
            if (this.summaryFormGroup.get('paymentStatus').value === 'CHARGE_PENDING') {
              this.showErrorMessage('exp.accpt.return.cargo.warining', null, [this.summaryFormGroup.get('billingErrorPlaceholder').value]); //Charges pending for {0}. Please pay the charges and confirm Return Cargo.
            } else {
              this.onPrintGatePass();
              this.summaryFormGroup.reset();
              this.displayFlag = false;
              this.showSuccessStatus('uld.operation.completed.successfully');
            }
          }
        }
      })
    }).catch(reason => {
    });
  }


  onEnquireCharges() {
    const requestObject = {
      shipmentNumber: this.summaryFormGroup.get('shipmentNumber').value,
      shipment: this.summaryFormGroup.get('shipmentNumber').value,
      returnAWBSummary: true,
      acceptanceType: this.summaryFormGroup.get('acceptanceType').value,
      shipmentType: 'AWB'
    };
    this.navigateTo(this.router, 'billing/collectPayment/enquireCharges', requestObject);
  }

  cancelReturn() {
    this.summaryFormGroup.get('returnReason').setValue(null);
    this.summaryFormGroup.get('tansferCTO').setValue(null);
    this.summaryFormGroup.get('newShipmentNumber').setValue(null);
    this.summaryFormGroup.get('returnRemarks').setValue(null);
    this.summaryFormGroup.get('showReturnSection').setValue(false);
    this.summaryFormGroup.get('returnReason').clearValidators();
    this.summaryFormGroup.get('returnRemarks').clearValidators();
    this.summaryFormGroup.get('tansferCTO').clearValidators();
    this.summaryFormGroup.get('newShipmentNumber').clearValidators();

    if (this.summaryFormGroup.get('returnRequested').value) {
      let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();

      this.exportService.cancelReturnCargo(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.summaryFormGroup.patchValue(response.data);
            this.showSuccessStatus('uld.operation.completed.successfully');
          }
        }
      });
    }

  }

  public onWeighing1(event) {
    var dataToSend = {
      shipmentNumber: '61894739479',
      hawbNumber: 'H1'
    }
    console.log("data", dataToSend);
    this.navigateTo(this.router, 'export/acceptance/acceptanceweighing', dataToSend);
  }

  //returns true if exactly one House is Selected
  isSingleShippingBillSelected(): boolean {
    let houseSummaryList: Array<AcceptanceWeighingSummaryHouseListModel> = this.summaryFormGroup.get('houseSummaryList').value;
    let count: number = houseSummaryList.map(obj => obj.select).filter(select => select).length;
    return count === 1;
  }

  //returns true if one or more Houses are Selected
  isShippingBillSelected(): boolean {
    let houseSummaryList: Array<AcceptanceWeighingSummaryHouseListModel> = this.summaryFormGroup.get('houseSummaryList').value;
    let count: number = houseSummaryList.map(obj => obj.select).filter(select => select).length;
    return count > 0;
  }

  public onAddSB(event) {
    const newRow: AcceptanceWeighingSummaryHouseListModel = new AcceptanceWeighingSummaryHouseListModel();
    (<NgcFormArray>this.summaryFormGroup.get(['houseSummaryList'])).addValue([newRow]);

  }

  onDeleteSB(index) {
    let request: AcceptanceWeighingSummaryHouseListModel = (((<NgcFormArray>this.summaryFormGroup.get("houseSummaryList")).getRawValue())[index]);
    if (request.shipmentHouseId == null) {
      (<NgcFormArray>this.summaryFormGroup.get(['houseSummaryList'])).markAsDeletedAt(index);

    }
    // else {
    //   this.exportService.deleteSB(request).subscribe(response => {
    //     this.resetFormMessages();
    //     if (response !== null) {
    //       if (!this.showResponseErrorMessages(response)) {
    //         this.summaryFormGroup.patchValue(response.data);
    //         this.showSuccessStatus('uld.operation.completed.successfully');
    //       }
    //     }
    //   })
    // }
  }

  onSave(event) {
    this.summaryFormGroup.validate();
    if (!this.summaryFormGroup.valid) {
      return;
    }
    else {
      let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
      this.exportService.saveAcceptanceSummary(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.summaryFormGroup.patchValue(response.data);
            this.showSuccessStatus('uld.operation.completed.successfully');
          }
        }
      })
    }
  }


  onClear(event): void {
    if (this.displayFlag) {
      let acceptanceType: string = this.summaryFormGroup.get('acceptanceType').value;
      this.summaryFormGroup.reset();
      this.summaryFormGroup.get('acceptanceType').setValue(acceptanceType);
    } else {
      this.searchFormGroup.reset();
    }
  }

  onChangeBondedTruck(event) {
    if (this.summaryFormGroup.get('isBondedTruck').value && NgcUtility.isTenantCityOrAirport(this.summaryFormGroup.get('origin').value)) {
      this.summaryFormGroup.get('origin').setValue("");
      //this.summaryFormGroup.get('incomingFlightKey').setValidators([Validators.required]);
      //this.summaryFormGroup.get('incomingFlightDate').setValidators([Validators.required]);
    }
    else if (!this.summaryFormGroup.get('isBondedTruck').value && !NgcUtility.isTenantCityOrAirport(this.summaryFormGroup.get('origin').value)) {
      this.summaryFormGroup.get('origin').setValue(NgcUtility.getTenantConfiguration().airportCode);
      this.summaryFormGroup.get('incomingFlightKey').setValue("");
      this.summaryFormGroup.get('incomingFlightDate').setValue(null);
      // this.summaryFormGroup.get('incomingFlightKey').clearValidators();
      //this.summaryFormGroup.get('incomingFlightDate').clearValidators();
    }
  }

  onChangeOrigin(event) {
    if (!NgcUtility.isTenantCityOrAirport(this.summaryFormGroup.get('origin').value)) {
      this.summaryFormGroup.get('isBondedTruck').setValue(true);
    }
  }
  onPrintSbReport() {

    this.reportParameters = new Object();
    this.reportParameters.loginuser = this.getUserProfile().userShortName;
    this.reportParameters.shipmentId = this.summaryFormGroup.get('shipmentId').value;
    this.reportParameters.documentInformationId = this.summaryFormGroup.get('documentInformationId').value;
    this.reportWindow.open();

  }

  private onPrintGatePass() {
    this.reportParameters = new Object();
    this.reportParameters.acceptanceType = '(For International Freight)';
    this.reportParameters.sbFlag = false;
    this.reportParameters.loginuser = this.getUserProfile().userShortName;
    this.reportParameters.documentInformationId = this.summaryFormGroup.get('documentInformationId').value;
    this.reportParameters.shipmentId = this.summaryFormGroup.get('shipmentId').value;
    this.reportParameters.staffId = this.getUserProfile().userLoginCode;
    this.reportWindow1.open();
  }

  onPrintCreditNote(creditDebitNote: CreditDebitNote) {
    this.reportParameters = new Object();
    this.reportParameters.paymentReceiptId = creditDebitNote.creditDebitNoteReceiptId;
    this.reportParameters.invoiceNumber = creditDebitNote.receiptNumber;
    this.reportWindow2.format = ReportFormat.PDF;
    this.reportWindow2.open();
  }

  onCloseFailureData() {

    const closeFailureRequest: ShipmentExecModel = new ShipmentExecModel();
    const requestData = this.summaryFormGroup.get('ruleShipmentExecutionDetails').value;
    const shipmentWarnDetails = [];
    const shipmentInfoDetails = [];
    for (const eachRow of requestData.execWarnList) {
      if (eachRow.acknowledge && !eachRow.issueClosedOn) {
        eachRow.recordId = eachRow.failureId;
        shipmentWarnDetails.push(eachRow);
      }
    }
    for (const eachRow of requestData.execInfoList) {
      if (eachRow.acknowledge && !eachRow.issueClosedOn) {
        eachRow.recordId = eachRow.failureId;
        shipmentInfoDetails.push(eachRow);
      }
    }
    closeFailureRequest.shipmentWarnDetails = shipmentWarnDetails;
    closeFailureRequest.shipmentInfoDetails = shipmentInfoDetails;
    this._cargoEngineProcessService.oncloseFailure(closeFailureRequest).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.fetchRuleExecutionList();
      };
    });
  }

  fetchRuleExecutionList() {
    let cargo = this.summaryFormGroup.getRawValue();
    //Research the data
    this.exportService.fetchRuleShipmentExecutionListAccptByHouse(cargo).subscribe(response => {
      let ruleShipmentExecutionDetails: any;
      ruleShipmentExecutionDetails = response.data.ruleShipmentExecutionDetails;
      this.summaryFormGroup.get('ruleShipmentExecutionDetails').patchValue(response.data.ruleShipmentExecutionDetails);
      if (response.data.acknowledgeIndicatorCPE) {
        this.actionlistindicator = "error"
      } else {
        this.actionlistindicator = "";
      }
    });
  }

  getFlightOffPoint(event) {
    let request: AcceptanceWeighingSummaryModel = this.summaryFormGroup.getRawValue();
    this.summaryFormGroup.get('firstOffPoint').patchValue(null);
    this.flightOffPointDropdownSourceParam = this.createSourceParameter(this.summaryFormGroup.get('firstBookedFlight').value, NgcUtility.getDateTimeAsStringByFormat(this.summaryFormGroup.get('firstBookedFlightDate').value, 'YYYY-MM-DD')); //Updting Flight Off Point DropDown
    //if (request.firstBookedFlight != null && request.firstBookedFlightDate != null && request.firstBookedFlight.length > 0) {
    // this.exportService.getFlightOffPointSummary(request).subscribe(response => {
    //   if (response !== null) {
    //     if (!this.showResponseErrorMessages(response)) {
    //       this.summaryFormGroup.get('firstOffPoint').patchValue(response.data.firstOffPoint);
    //     }
    //   }
    // })
    //}

  }


  onChangeManualBookingInfo(event) {
    if (event) {
      this.summaryFormGroup.get('firstBookedFlightDate').setValidators(Validators.required);
      this.summaryFormGroup.get('firstBookedFlight').setValidators(Validators.required);
      this.summaryFormGroup.get('firstOffPoint').setValidators(Validators.required);
    } else {
      this.summaryFormGroup.get('firstBookedFlight').clearValidators();
      this.summaryFormGroup.get('firstBookedFlightDate').clearValidators();
      this.summaryFormGroup.get('firstOffPoint').clearValidators();
    }
  }

  onChangeReturnReason(event) {
    if (event === "CTO_TRANSFER") {
      this.summaryFormGroup.get('tansferCTO').setValidators(Validators.required);
      this.summaryFormGroup.get('newShipmentNumber').setValidators(Validators.required);
      this.summaryFormGroup.get('returnRemarks').clearValidators();
    } else if (event === "AWB_RETURN") {
      this.summaryFormGroup.get('returnRemarks').setValidators(Validators.required);
      this.summaryFormGroup.get('tansferCTO').setValue(null);
      this.summaryFormGroup.get('newShipmentNumber').setValue(null);
      this.summaryFormGroup.get('tansferCTO').clearValidators();
      this.summaryFormGroup.get('newShipmentNumber').clearValidators();
    }
  }

  onShipmentNumberChange(event) {
    this.searchFormGroup.get('isBondedTruck').reset();
  }

}